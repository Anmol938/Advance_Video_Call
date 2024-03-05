var connection  =  new WebSocket("ws://localhost:8000");
connection.onopen= function(){
    console.log("Connected to the server");
}

connection.onmessage = function(msg){
        var data = JSON.parse(msg.data);
        switch(data.type)
        {
         case "online":
                onlineProcess(data.success);
                console.log(data);
                break;     
         case "not available":
                call_status.innerHTML= '';
                alert(data.name+ ' user not available');
                call_btn.removeAttribute("disabled");
                break;       
         case "offer":
                call_btn.setAttribute("disabled","disabled");
                call_status.innerHTML='<div class="calling-status-wrap card black white-text"> <div class="user-image"> <img src="'+data.image+'" class="caller-image circle" alt=""> </div> <div class="user-name">'+data.name.name+'</div> <div class="user-calling-status">Calling...</div> <div class="calling-action"> <div class="call-accept"><i class="material-icons green darken-2 white-text audio-icon">call</i></div> <div class="call-reject"><i class="material-icons red darken-3 white-text close-icon">close</i></div> </div> </div>';
                var call_accept = document.querySelector('.call-accept');
                var call_reject = document.querySelector('.call-reject');
                
                call_accept.addEventListener("click", function(){
                    offerProcess(data.offer, data.name);
                    call_status.innerHTML = '';    
                });
                
                call_reject.addEventListener("click", function(){
                    call_status.innerHTML = '';    
                    alert('Call is rejected');
                    call_btn.removeAttribute("disabled");
                });
                break; 
         case "answer":
                    answerProcess(data.answer);             
                    break;
         case "candidate":
                    candidateProcess(data.candidate);             
                    break;                        
        }
}

connection.onerror = function(error)
{
    console.log(error);
}
var name;
var connectedUser;
var myConn;
var local_video = document.querySelector('#local-video');

var call_to_username_input = document.querySelector('#username-input');
var call_btn = document.querySelector('#call-btn');
var call_status = document.querySelector('.call-hang-status');

call_btn.addEventListener("click", function(){
        var call_to_username = call_to_username_input.value;
        if(call_to_username.length > 0 )
        {
            connectedUser = call_to_username.toLowerCase();
            if(username == connectedUser){
                alert("You can't call yourself");
            }
            else{
            call_status.innerHTML='<div class="calling-status-wrap card black white-text"> <div class="user-image"> <img src="/images/user.jpg" class="caller-image circle" alt=""> </div> <div class="user-name">unknown user</div> <div class="user-calling-status">Calling...</div> <div class="calling-action"><div class="call-reject"><i class="material-icons red darken-3 white-text close-icon">close</i></div> </div> </div>';             
           
            var call_reject = document.querySelector('.call-reject');
            
            call_reject.addEventListener("click", function(){
                call_status.innerHTML = '';    
                alert('Call is rejected');
                call_btn.removeAttribute("disabled");
            });

            call_btn.setAttribute("disabled","disabled");        
            myConn.createOffer(function(offer){
                send({
                    type:"offer",
                    offer: offer,
                    image:userImage
                });
                myConn.setLocalDescription(offer);
            },function(){
                alert("Offer has not been created!");
            });
            }
        }
        else{
            alert("Please enter username");
        }
});



navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


setTimeout(function(){
    if(connection.readyState == 1)
{
    if(username != null){
            name = username;
            console.log('Username is :-'+name);
            send({
                type: "online",
                name:  name
            });
    }
    else{
        console.log("Something went wrong");
    }
}
},3000);

function send(message){
    if(connectedUser){
        message.name = connectedUser;
        
    }
    connection.send(JSON.stringify(message));
}

function onlineProcess(success){
    if(success)
    {
        navigator.getUserMedia(
            {
                audio:true,
                video:true,
            },
            function (myStream){
                var stream = myStream;
                local_video.srcObject = stream;
                var configuration = {
                              "iceServers": [
                                {"url":"stun:stun4.l.google.com:19302"}
                                    
                                    ]
                                    }
               myConn =  new webkitRTCPeerConnection(configuration,{
                    optional:[
                        {
                            RTPDataChannels: true 
                        }
                    ]
                });

                myConn.addStream(stream);

                myConn.onicecandidate = function(event){
                    if(event.candidate){
                        send({
                            type: "candidate",
                            candidate: event.candidate
                        })
                    }
                }
            },
            function(error){
                alert("You can't access media");
            }
        );
    }
    else{
        alert("Something went wrong");
    }
}

function offerProcess(offer, name){
    connectedUser = name;
    console.log("here uou go"+connectedUser.name);
    myConn.setRemoteDescription(new RTCSessionDescription(offer));
   // alert("Following user wants to connect with you" +connectedUser.name);
    //create answer to an offer or first user
    myConn.createAnswer(function(answer){
        myConn.setLocalDescription(answer);
        send({
            type: "answer",
            answer: answer
        });
    }, function(error){
        alert("Answer has not been created");
    });
}

function answerProcess(answer){
    myConn.setRemoteDescription(new RTCSessionDescription(answer));

}

function candidateProcess(candidate){
    myConn.addIceCandidate(new RTCIceCandidate(candidate));
}