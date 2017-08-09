console.log('Counter Incremented!');
var request = new XMLHttpRequest();
request.onreadystatechange = function(){
    if (request.readyState === XMLHttpRequest.DONE){
        if (request.status === 200){
            var cnt = request.responseText;
            var chng = document.getElementById("countText");
            chng.value = cnt.toString();
        }
    }
};
request.open('GET','http://dragonlordthota717.imad.hasura-app.io/counter', true);
request.send(null);

var button = document.getElementById('commSub');
button.onclick = function(){
    var comm = document.getElementById('commText').value;
    var commList = ["Lol","Kek","Hehe"];
    var list = '';
    for(var i = 0; i<commList.length;i++){
        
    }
};