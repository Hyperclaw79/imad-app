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

console.log('LOADED');
//counter code
var button = document.getElementById('clicky');
button.onClick = function() {
   var request = new XMLHttpRequest();
  
  //Capture The Response And Store In HTML
  request.onreadystatechange = function() 
{
      if (request.readyState === XMLHttpRequest.DONE) 
      {
          //Take Some Action
          if (request.status === 200) 
            { 
                var counter = request.responseText; 
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            } 
      } 
   }; 
 request.open("GET", "http://dragonlordthota717.imad.hasura-app.io/counter", true);
 request.send(); 
  
};

             
console.log('EXECUTED');
