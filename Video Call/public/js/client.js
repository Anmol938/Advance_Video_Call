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
var local_video = document.querySelector('#local-video');

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
        message.name - connectedUser;
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


