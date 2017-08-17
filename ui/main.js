function loader(){

var sess = new XMLHttpRequest();
    sess.onreadystatechange = function(){
        if (sess.readyState === XMLHttpRequest.DONE){
            if (sess.status === 200){
                if(sess.responseText==="Active"){
                    $('#logout_button').show();
                    $('#dropbtn').hide();
                }
                else{
                    $('#logout_button').hide();
                    $('#dropbtn').show();
                }
            }
        }
    };
    sess.open('GET','http://dragonlordthota717.imad.hasura-app.io/check-session', true);
    sess.send(null);
    
    $('#dropbtn').hover(function() {
      $('#loginForm').show();
    }, function() {
      if ($(this).data('clicked') !== "yes") {
        $('#loginForm').hide();
      }
    });
    
    $('#dropbtn').click(function() {
      $(this).data('clicked', 'yes');
      $('#loginForm').css('display', 'block');
    });
    
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
                $('#loginForm').hide();
                $('#dropbtn').hide();
                $('#logout_button').show();
            }
            else if (request.responseText === 'Account does not exist. Please Register.'){
                if(confirm("That username doesn't exist. Click OK to register now.")=== true){
                    $('.registration-form').show();
                }
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



function logout(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200){
                $('#logout_button').hide();
                $('#dropbtn').show();
                alert(request.responseText);
            }
            else{
                alert('Unable to logout. Please try again.');
            }
        }
    };
    request.open('GET','http://dragonlordthota717.imad.hasura-app.io/logout', true);
    request.send(null);
}