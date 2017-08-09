var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var counter = 650;
app.get('/counter', function (req, res){
  counter = counter + 1;
  res.send(counter.toString());
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile("https://www.shareicon.net/download/2015/09/24/106441_man.ico");
});

app.get('/:comm', function (req, res) {
  var comment = req.params.comm;
  res.send(updateComment(comment));
});

app.get('/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
console.log(`IMAD course app listening on port ${port}!`);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var articles = {
    'article-one': {
        title: "You are viewing Article One!",
        date: "2nd August",
        heading: "This is article one.",
        content: `<div>
                    <p>This is the first dummy article.</p>
                </div>`
    },
    'article-two': {
        title: "You are viewing Article Two!",
        date: "2nd August",
        heading: "This is article two.",
        content: `<div>
                    <p>This is a second dummy article.</p>
                </div>`
    },
    'article-three': {
        title: "You are viewing Article Three!",
        date: "2nd August",
        heading: "This is article three.",
        content: `<div>
                    <p>Another dummy article for you.</p>
                </div>`
    }
};
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
                <title>
                    ${title}
                </title>    
            </head>
            <body>
                <div class="container">
                    <div>
                        <h1>${heading}</h1>
                        <p>${date}</p>
                    </div>
                    ${content}
                </div>
                <footer>Click <a href = "/">here</a> to go back to the homepage.</footer>
            </body>            
         </html>`;
         return htmlTemplate;
}

var commList = [];
function updateComment(comment){
    var newComm = comment;
    commList.push(newComm);
    /*var subTemplate = '';
    for(var i=0;i<commList.length;i++){
        
        subTemplate = subTemplate + `<div class="bubble-list">
             <div class="bubble clearfix">
                <img src="#"/>
             <div class="bubble-content">
                <div class="point"></div>
                <p>${commList[commList.length-1]}</p>
             </div>`;
        }*/
    var subTemplate = `<div class="bubble-list">
             <div class="bubble clearfix">
                <img src="#"/>
             <div class="bubble-content">
                <div class="point"></div>
                <p>${commList[commList.length-1]}</p>
             </div>`;
    var commentTemplate = 
    `<html>
       <head>
          <title>Comments</title>
    	  <style>
    		body {
    			background-color:#f0f0ee;
    			font:1em "Trebuchet MS";
            }
    		.bubble img {
    			float:left;
    			width:70px;
    			height:70px;
    			border:3px solid #ffffff;
    			border-radius:10px
            }
    		.bubble-content {
    			position:relative;
    			float:left;
    			margin-left:12px;
    			width:400px;
    			padding:0px 20px;
    			border-radius:10px;
    			background-color:#FFFFFF;
    			box-shadow:1px 1px 5px rgba(0,0,0,.2);
    		}
    		.bubble {
    			margin-top:20px;
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
    		}
    		* html .clearfix {
    				height: 1%;
    				}
    	</style>
       </head>
       <body>
          <div class="bubble-list">
             <div class="bubble clearfix">
                <img src="#"/>
             <div class="bubble-content">
                <div class="point"></div>
                <p>This is the first comment made by Harshith Thota himself.</p>
             </div>
    	  ${subTemplate}   	
       </body>
    </html>`;
    return commentTemplate;
}

