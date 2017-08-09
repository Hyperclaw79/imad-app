var button = document.getElementById('commSub');
button.onclick = function(){
    var commText = document.getElementById('commText').value;
    var reqC = new XMLHttpRequest();
    url = 'http://dragonlordthota717.imad.hasura-app.io/submit-comment?comm='+commText;
    window.open(url);
    reqC.open('GET',url, true);
    reqC.send(null);
};

