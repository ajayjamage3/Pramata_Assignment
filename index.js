// modules
const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const app = express()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {connection} = require("./config")
const {UserModel} = require("./UserModel")

//server connection 
const server = http.createServer(app)
const io = socketio(server)

const messages = {
    Group1:[],
    Group2:[],
    Group3:[],
    Group4:[]
};

const {
  userJoin,
  getRoomUsers,
  getCurrentUser,
  userLeave,
} = require("./utils/users");
const formateMessage = require("./utils/messages");


const boatName = "ChatServer";
const secretKey = "your-secret-key";

app.use(express.json());

app.post("/signup", async(req, res) => {
    const {email,password} = req.body
    try {
        bcrypt.hash(password,5,async(err,sec_pass)=>{
            if(err){
                console.log(err)
            }else{
                const user = new UserModel({email,password:sec_pass})
                await user.save()
                res.send({"status":"user registered succesfully"})
            }
        })
    } catch (error) {
        res.send(error)
    }
});

app.post("/login", async(req, res) => {
    const {email,password} = req.body
    try {
       const user = await UserModel.find({email})
       if(user.length>0){
        const hashed_pass = user[0].password
        bcrypt.compare(password,hashed_pass,(err,result)=>{
            if(result){
                const token = jwt.sign({userId:user[0]._id},"Ajay")
                res.send({"msg":"login succesfull","token":token,"userId":user})
            }
            else{
                res.send({"status":"wrong password"})
            }
        })
       }
       else{
            res.send({"status":"wrong username"})
       }
    } catch (error) {
        res.send(error)
    }
});



io.on("connection", (socket) => {

    console.log("one client joined")

    socket.on("joinRoom", ({ username, room }) => {


        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
         // history
        socket.emit("history",messages[user.room])

        // Welcome current 
        let formate = formateMessage(boatName, "Welcome to Masai Server");

        // messages[user.room].push(formate);

        socket.emit("message",formate )

        formate = formateMessage(boatName, `${user.username} has joined the chat`);

        messages[user.room].push(formate)
        // broadcat to other users
        socket.broadcast.to(user.room).emit("message", formate )

        //  Get all room user
        io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUsers(user.room)
        })

    })


    socket.on("chatMessage",(msg)=>{
          const user = getCurrentUser(socket.id)

          let formate = formateMessage(user.username,msg);
          messages[user.room].push(formate);
          io.to(user.room).emit("message",formate)
    });


    socket.on("disconnect",()=>{
        
        const user = userLeave(socket.id)

        let formate = formateMessage(boatName,`${user.username} has left the chat`)

                  messages[user.room].push(formate)
                  
        io.to(user.room).emit("message",formate)

          //  Get all room user
          io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUsers(user.room)
        })

    })

});





const PORT = 8080
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
try {
     connection
   
} catch (error) {
    
}