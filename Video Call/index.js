require('dotenv').config();

const express = require('express');
const app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/video-call-app');

app.listen(3000, ()=>{
    console.log('Server is running');
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('public'));

const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


//wbesocket code
var webSocketServ = require('ws').Server;
var wss = new webSocketServ({
    port:8000
});

var users = {};
wss.on("connection", function(conn){
    console.log('User Connected');
    conn.on("message", function(message){
       
        var data;
        try{
            data = JSON.parse(message);
        }
        catch(error){
            console.log(error);
        }

        switch(data.type)
        {
            case "online":
                    users[data.name] = conn;
                    conn.name = data;

                    sendToOtherUser(conn, {
                        type: 'online',
                        success: true
                    })
            break;
            case "offer":
                  var connect = users[data.name];
                  if(connect != null){
                    conn.otherUser = data.name;
                    console.log(data.offer);

                    sendToOtherUser(connect,{
                        type: "offer",
                        offer: data.offer,
                        name: conn.name
                    });
                  }
                  break;  
            case "answer":
                  var connect = users[data.name];
                  if(connect != null){
                    conn.otherUser = data.name;
                    sendToOtherUser(connect,{
                        type: "answer",
                        answer: data.answer
                    })
                  }
                  break;
            case "candidate":
                  var connect = users[data.name];
                  if(connect != null){
                    sendToOtherUser(connect, {
                        type: "candidate",
                        candidate: data.candidate
                    });
                  }
                break;      

        }



    });

    conn.on("close", function(){
        console.log("connection Closed");
    });

});

function sendToOtherUser(connection, message ){
    connection.send(JSON.stringify(message));
}