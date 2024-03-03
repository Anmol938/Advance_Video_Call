var local_video = document.querySelector('#local-video');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia(
    {
        audio:true,
        video:true,
    },
    function (myStream){
        stream = myStream;
        local_video.srcObject = stream;
    },
    function(error){
        alert("You can't access media");
    }
);