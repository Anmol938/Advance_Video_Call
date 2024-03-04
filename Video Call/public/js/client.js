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

call_btn.addEventListener("click", function(){
        var call_to_username = call_to_username_input.value;
        if(call_to_username.length > 0 )
        {
            connectedUser = call_to_username.toLowerCase();
            myConn.createOffer(function(offer){
                send({
                    type:"offer",
                    offer: offer
                });
                myConn.setLocalDescription(offer);
            },function(){
                alert("Offer has not been created!");
            });
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


