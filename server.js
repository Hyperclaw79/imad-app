var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
app.use(morgan('combined'));
var crypto = require('crypto');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var session = require('express-session');
app.use(session({
    secret: 'ChangeMeSenpai',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
    resave: false,
    saveUninitialized: false
}));

var Pool = require('pg').Pool;
var config = {
    user: 'dragonlordthota717',
    database: 'dragonlordthota717',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'man.ico'));
});

app.get('/userlist', function(req,res){
    
    pool.query('SELECT name FROM users',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/loginButton.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ironman_ios_2x_.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/commscript.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'commscript.js'));
});

var counter = {"pageviews":800};
app.get('/counter', function (req, res){
      pool.query("SELECT pageviews FROM users WHERE name='Hyperclaw79'",function(err,result){
          if(err){
            res.status(500).send(err.toString());  
          }
          else{
            counter = result.rows[0];
            flag = "From query";
            var cnt = counter.pageviews;
            cnt = parseInt(cnt)+1;
            if(isNaN(cnt)) res.status(500).send('Returned NaN as seen in: '+JSON.stringify(counter));
            else pool.query("UPDATE users SET pageviews = $1 WHERE name = 'Hyperclaw79'",[cnt]);
            return res.send(cnt.toString());

          }
      });

    });

app.get('/submit-comment', function (req, res) {
  var comm = req.query.comm;
  pool.query('SELECT "comment" FROM "comments"',function(err,result){
    if(err){
        res.status(500).send(err.toString());
    }
    else{
        var comm_List = [];
        for(var m = 0; m < result.rows.length;m++){
            comm_List[m]=result.rows[m].comment;
        }
        if(comm_List.indexOf(comm)==-1){
            pool.query('INSERT INTO "comments" ( "comment") VALUES ($1);',[comm],function(err,result){
                if(err){
                    res.status(500).send(err.toString());
                }
                else{
                    comm_List.push(comm);
                    res.send(updateComment(comm_List));
                }
            });
        }
    }
  });
  //res.send(updateComment(comment));
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString("hex")].join("$");
}

app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input,'salt_this_up_Jarvis');
    res.send(hashedString);
});

app.post('/register',function(req,res){
    var uname = req.body.username;
    var password = req.body.password;
    var profile = req.body.profile;
    var nname = req.body.nname;
    var salt = crypto.randomBytes(128).toString('hex');
    var hashedPwd = hash(password,salt);
    pool.query('INSERT INTO "users" ("name","imad-profile","username") VALUES ($1, $2, $3)',[nname,profile,uname],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            pool.query('INSERT INTO "authlist" ("username","password") VALUES ($1, $2)',[uname,hashedPwd],function(err,result){
                if(err){
                    res.status(500).send(err.toString());
                }
                else{
                    res.send("Account succesfully created with the username: "+uname);
                }
            });
        }
    });    
});

app.post('/check-user',function(req,res){
    var uname = req.body.username;
    pool.query('SELECT username FROM "authlist" WHERE "username" = $1',[uname],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length!==0){
                res.status(403).send('Account already exists.');
            }
            else{
                res.status(200).send('Permission Granted.');    
            }
        }
    });
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "authlist" WHERE "username" = $1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(403).send('Account does not exist. Please Register.');
            }
            else{
                var hashedPwd = result.rows[0].password;
                var salt = hashedPwd.split('$')[2];
                var saltyPwd = hash(password,salt);
                if(saltyPwd===hashedPwd){
                    req.session.auth = {userId: result.rows[0].session_id};
                    res.send('Succesfully Logged in.');
                }
                else{
                    res.status(403).send('Incorrect Password. Please try again. Hint:Password is case sensitive.');
                }
            }
        }
    });
});

app.get('/check-session',function(req,res){
    if(req.session&&req.session.auth&&req.session.auth.userId){
        return res.send('Active');
    }
    else{
        return res.send('Inactive:');
    }
});

app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('Successfully Logged out.');
});

app.get('/articles/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  pool.query("SELECT * FROM article WHERE title=$1",[articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(404).send('Article Not Found.');
            }
            else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
                
        }
    });
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
console.log(`IMAD course app listening on port ${port}!`);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate =
        `<html>
            <head>
                <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name = "author" content = "Harshith Thota"/>
                <meta charset="utf-8">
                <link rel="shortcut icon" href="https://www.shareicon.net/download/2015/09/24/106441_man.ico" type="image/x-icon" />
                <title>
                    ${title}
                </title>    
            </head>
            <body>
                <div class="container">
                    <div>
                        <h1>${heading}</h1>
                        <p>${date.toDateString()}</p>
                    </div>
                    ${content}
                </div>
                <footer>Click <a href = "/">here</a> to go back to the homepage.</footer>
            </body>            
         </html>`;
         return htmlTemplate;
}

var urlList = ["https://www.sideshowtoy.com/wp-content/uploads/2016/04/captain-america-civil-war-iron-man-xlvi-sixth-scale-marvel-feature-902708.jpg","http://themepack.me/i/c/749x468/media/g/149/iron-man-theme-1.jpg","https://www.sideshowtoy.com/photo_902622_thumb.jpg","http://worldversus.com/img/ironman.jpg","https://www.sideshowtoy.com/assets/products/400310-iron-man-mark-iii/lg/marvel-iron-man-mark-3-life-size-figure-400310-08.jpg","https://s-media-cache-ak0.pinimg.com/736x/52/08/ac/5208ac301eb3fb378dc6b69a5e94c6ec--marvel-heroes-marvel-dc.jpg","https://images-na.ssl-images-amazon.com/images/G/01/DVD/Paramount/detailpages/IronMan/IronMan_Still_H5_L.jpg","https://ctd-thechristianpost.netdna-ssl.com/en/full/30892/iron-man-4.jpg","https://s-media-cache-ak0.pinimg.com/736x/5d/99/cd/5d99cdab52c1afda4af0b97a116dbda0--comic-art-comic-book.jpg","https://s-media-cache-ak0.pinimg.com/736x/8b/b1/60/8bb160c9f3b45906ef8ffab6ac972870--marvel-dc-comics-avengers-marvel.jpg"];
function updateComment(commList){
    var colList = [];
    for(var k=0;k<commList.length;k++){
        var letters = '0123456789ABCDEF';
        var col = '#';
        for (var l = 0; l < 6; l++) {
             col += letters[Math.floor(Math.random() * 16)];
        }
        colList[k]= col;
    }
    var subTemplate = `<div class="bubble-list"  style = "width:110%;height:110%;padding-left:5px">
             <div class="bubble clearfix"  style = "padding-top:5px">
                <img src="https://avatars3.githubusercontent.com/u/29298411?v=4&s=400"/ style = "border: 3px solid ${colList[i]};width:100px;height:100px;box-shadow:10px 10px 5px rgba(0,0,0,.2);"/>
             <div class="bubble-content" style = "margin-top:25px">
                <div class="point"></div>
                <p>This is the first comment made by Harshith Thota himself.</p>
             </div>
    	  `;
    for(var i=0;i<commList.length;i++){
        subTemplate = subTemplate + `<div class="bubble-list" style="padding-left:15px">
             <div class="bubble clearfix">
                <img src=${urlList[Math.round(Math.random()*urlList.length)]} style = "border: 3px solid ${colList[i]};width:80px;height:80px;box-shadow:10px 10px 5px rgba(0,0,0,.2);"/>
             <div class="bubble-content" style = "border: 3px solid ${colList[i]};">
                <div class="point"></div>
                <p>${commList[i]}</p>
             </div>`;
        }
    var commentTemplate = 
    `<html>
       <head>
          <title>Comment Feed for Harshith Thota's IMAD Profile</title>
          <style>
    		body {
    			background-color:#f0f0ee;
    			font:1em "Trebuchet MS";
    			background-image: url(https://images6.alphacoders.com/517/thumb-1920-517273.jpg);
    			background-size: cover;
                background-repeat: no-repeat;
                background-attachment: fixed;
            }
    		.bubble img {
    			float:left;
    			width:80px;
    			height:80px;
    			border:3px solid #000;
    			border-radius:10px;
    			margin-bottom: 5px;
            }
    		.bubble-content {
    			position:relative;
    			float:left;
    			margin-top:12px;
    			margin-left:12px;
    			width:550px;
    			padding:0px 20px;
    			border-radius:10px;
    			background-color:#FFFFFF;
    			box-shadow:10px 10px 5px rgba(0,0,0,.2);
    			border:3px solid #000;
    		}
    		.bubble {
    			margin-top:20px;
    			margin-right: 5px
    		}
    		.point {
    			border-top:10px solid transparent;
    			border-bottom:10px solid transparent;
    			border-right: 12px solid #FFF;
    			position:absolute;
    			left:-10px;
    			top:12px;
    		}
    		.clearfix:after {
    			visibility:hidden;
    			display:block;
    			font-size:0;
    			content: ".";
    			clear:both;
    			height:0;
    			line-height:
    		}
    		.clearfix {
    			display: inline-block;
    			margin-right: 7px
    			margin-bottom: 5px
    		}
    		* html .clearfix {
    				height: 1%;
    				}
    	</style>
    	<link rel="shortcut icon" href="https://www.shareicon.net/download/2015/09/24/106441_man.ico" type="image/x-icon" />
    	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name = "author" content = "Harshith Thota"/>
        <meta charset="utf-8">
       </head>
       <body>
          <script>
            $(document).ready(setInterval(function(){location.reload();},20000));
          </script>
          <div id="header" style="margin: 30px;background-color: rgba(255, 255, 255, 0.4);border: 3px solid black;box-shadow:10px 10px 5px rgba(0,0,0,.2);border-radius:10px;"><h1 style="text-shadow: 3px 3px 5px blue;">Here is the anonymous comment feed:</h1></div>
          <div id = "commcust" style="margin: 30px;background-color: rgba(255, 255, 255, 0.4);border: 5px solid black;box-shadow:10px 10px 5px rgba(0,0,0,.2);border-radius:10px;display:table;width:-webkit-fill-available">
            ${subTemplate}
          </div>
       </body>
    </html>`;
    return commentTemplate;
}

