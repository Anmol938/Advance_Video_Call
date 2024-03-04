var connection  =  new WebSocket("ws://localhost:8000");
connection.onopen= function(){
    console.log("Connected to the server");
}

connection.onmessage = function(msg){
        var data = JSON.parse(msg.data);
}

connection.onerror = function(error)
{
    console.log(error);
}

var local_video = document.querySelector('#local-video');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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