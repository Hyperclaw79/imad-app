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
                    register();
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

function checkUser(data){
    var request = new XMLHttpRequest();
    var uname = data;
    request.open('POST','http://dragonlordthota717.imad.hasura-app.io/check-user', true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"username":uname}));
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 403){
                return false;
            }
            else if(request.status === 200){
                return true;
            }
        }
    };
}

function register(){
   var uname = "";
   var nname = "";
   var profile = "";
   var pwd = "";    
   $('.register_username').on("change keyup paste",
      function(){
        if($(this).val()){
            $('.icon-uname').addClass("next");            
        } 
        else {
            $('.icon-uname').removeClass("next");
        }
      }
    );
    
    $('.next-button').hover(
      function(){
        $(this).css('cursor', 'pointer');
      }
    );
    
    $('.next-button.username').click(function(){
            if(checkUser($('.register_username').val())){ 
                uname = $(this).val();
                $('.username-section').addClass("fold-up");
                $('.name-section').removeClass("folded");
            }
            else alert('Account already exists. Please Login.');
    });
    $('.register_name').on("change keyup paste",
      function(){
        if($(this).val()){
          $('.icon-name').addClass("next");
        } else {
          $('.icon-name').removeClass("next");
        }
      }
    );
    
    $('.next-button').hover(
      function(){
        $(this).css('cursor', 'pointer');
      }
    );
    
    $('.next-button.name').click(
      function(){
        nname = $('register_name').val();        
        $('.name-section').addClass("fold-up");
        $('.email-section').removeClass("folded");
      }
    );
    
    $('.email').on("change keyup paste",
      function(){
         var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test($(this).val())){
          profile = $(this).val();    
          $('.icon-paper-plane').addClass("next");
        } else {
          $('.icon-paper-plane').removeClass("next");
        }
      }
    );
    
    $('.next-button').hover(
      function(){
        $(this).css('cursor', 'pointer');
      }
    );
    
    $('.next-button.email').click(
      function(){
        $('.email-section').addClass("fold-up");
        $('.password-section').removeClass("folded");
      }
    );
     
    $('.password').on("change keyup paste",
      function(){
        if($(this).val()){
          $('.icon-lock').addClass("next");
        } else {
          $('.icon-lock').removeClass("next");
        }
      }
    );
    
    $('.next-button').hover(
      function(){
        $(this).css('cursor', 'pointer');
      }
    );
    
    $('.next-button.password').click(
      function(){
        $('.password-section').addClass("fold-up");
        $('.repeat-password-section').removeClass("folded");
      }
    );
    
    $('.repeat-password').on("change keyup paste",
      function(){
        if($(this).val()===$('.password').val()){
          $('.icon-repeat-lock').addClass("next");
          pwd = $(this).val();
        } else {
          $('.icon-repeat-lock').removeClass("next");
        }
      }
    );
    
    $('.next-button.repeat-password').click(
      function(){
        $('.repeat-password-section').addClass("fold-up");
        $('.success').css("marginTop", 0);
      }
    );

    var request = new XMLHttpRequest();
    if((uname.length+nname.length+profile.length+pwd.length)>14){
        request.open('POST','http://dragonlordthota717.imad.hasura-app.io/register', true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify({"username":uname,"name":nname,"imad-profile":profile,"password":pwd}));
    }
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