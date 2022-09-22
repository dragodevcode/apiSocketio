 import  express  from "express";
 import { Server as WebSocketServer } from "socket.io";
 import cors from 'cors'
 import http from 'http'

 const app = express()

 const activeUsers = new Set();
 const activeUsersIdUSer = []


 const server = http.createServer(app)
 const io = new WebSocketServer(server,{
    cors: {
        origin: "*"
      }
 })



 function deleteUser(idZ){

    console.log("si llego aqui")
    activeUsersIdUSer.forEach(function(id, index, object) {
        if(id.id === idZ){

          object.splice(index, 1);
        }
    });

    // for (let index = 0; index < activeUsersIdUSer.length; index++) {
    //     if(id == activeUsersIdUSer[index].id){


    //         break
    //     }
        
    // }
 }

 function validUser(user,idx){
    let userValud = true
    activeUsersIdUSer.forEach((datax)=>{

        if(datax.id == idx){
            if(datax.username == user){
                userValud = false
                
            }
        }
    })

    return userValud
    
 }


 io.on("connection", (socket) => {

  

    socket.on("conect",(username)=>{
        io.sockets.sockets.forEach((dataSock)=>{
            if(dataSock.id == socket.id){

                if(activeUsersIdUSer.find(usr => usr.id == dataSock.id) === undefined){
     
                    activeUsersIdUSer.push({username:username,id:socket.id})
                }
            }
        })

        socket.userId = username
        activeUsers.add(username)
    })


    socket.on('getActive',()=>{
        io.emit("userActive",[...activeUsers])
    })


    socket.on("credit",(datacredit)=>{

        let usernamex = activeUsersIdUSer.find(usr => usr.id == socket.id)
        if(usernamex != undefined){
            activeUsersIdUSer.forEach((datac) =>{

                if(datac.username == usernamex.username){

                    io.to(datac.id).emit("updateCredit",{credit:datacredit})
                }
                
            })
        }
       
    })


    socket.on('passNoti',(data)=>{

        io.emit('dataNoti',{noti:data})
    })
    socket.on('setreload',()=>{
        io.emit("getReload",{status:'reload'})
    })
    socket.on("disconnect", () => {


        //console.log(socket.id,'ID')
        deleteUser(socket.id)

       
        //console.log(activeUsersIdUSer,'QUE PES')
        activeUsers.delete(socket.userId);
        //activeUsersIdUSer.delete({username:socket.userId,id:socket.id})
        console.log("desconexion",activeUsers)

        //console.log(activeUsersIdUSer)
        socket.broadcast.emit("userActive", [...activeUsers]);
      });


  });

 server.listen(8087)
 console.log("server on port",8087)
