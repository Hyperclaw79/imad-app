var button = document.getElementById('commSub');
button.onclick = function(){
    var commText = document.getElementById('commText').value;
    var reqC = new XMLHttpRequest();
    url = 'http://dragonlordthota717.imad.hasura-app.io/submit-comment?comm='+commText;
    window.open(url);
    request.open('GET',url, true);
    request.send(null);
};
function loader(){
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
}    