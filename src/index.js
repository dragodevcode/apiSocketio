 import  express  from "express";
 import { Server as WebSocketServer } from "socket.io";
 import cors from 'cors'
 import http from 'http'

 const app = express()

 const activeUsers = new Set();


 const server = http.createServer(app)
 const io = new WebSocketServer(server,{
    cors: {
        origin: "http://localhost:4200"
      }
 })



 io.on("connection", (socket) => {

    console.log("si conecta")

    socket.on("conect",(username)=>{
        console.log(username)
        socket.userId = username
        activeUsers.add(username)
    })


    socket.on('getActive',()=>{
        io.emit("userActive",[...activeUsers])
    })


    socket.on('passNoti',(data)=>{

        io.emit('dataNoti',{noti:data})
    })
    socket.on('setreload',()=>{
        io.emit("getReload",{status:'reload'})
    })
    socket.on("disconnect", () => {

        activeUsers.delete(socket.userId);
        console.log("desconexion",activeUsers)
        socket.broadcast.emit("userActive", [...activeUsers]);
      });


  });

 server.listen(3400)
 console.log("server on port",3400)
