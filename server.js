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

app.get('/article-one', function (req, res) {
  res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
  res.send(createTemplate(articleTwo));
});

app.get('/article-three', function (req, res) {
  res.send(createTemplate(articleThree));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var articleOne = {
    title: "You are viewing Article One!",
    date: "2nd August",
    heading: "This is article one.",
    content: `<div>
                <p>This is just a dummy article.</p>
            </div>`
};
var articleTwo = {
    title: "You are viewing Article Two!",
    date: "2nd August",
    heading: "This is article two.",
    content: `<div>
                <p>This is just a dummy article.</p>
            </div>`
};
var articleThree = {
    title: "You are viewing Article Three!",
    date: "2nd August",
    heading: "This is article three.",
    content: `<div>
                <p>This is just a dummy article.</p>
            </div>`
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
                    $(title)
                </title>    
            </head>
            <body>
                <div class="container">
                    <div>
                        <h1>$(heading)</h1>
                        <p>$(date)</p>
                    </div>
                    $(content)
                </div>
                <footer>Click <a href = "/">here</a> to go back to the homepage.</footer>
            </body>            
         </html>`;
         return htmlTemplate;
}



