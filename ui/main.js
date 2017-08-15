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
function verify(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200){
                alert('Successfully Logged in.');
            }
            else{
                alert(request.responseText);
            }
        }
    };
    var uname = document.getElementById('uname').value;
    var pwd = document.getElementById('pwd').value;
    request.open('POST','http://dragonlordthota717.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"username":uname,"password":pwd}));
}