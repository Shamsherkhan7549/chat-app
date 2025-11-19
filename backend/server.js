
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

//create server
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send("hello world")
});

io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED : ", socket.id);

  socket.on("join-room", (room) => {
        socket.join(room);
        io.to(room).emit("room-joined", room);
        console.log("user join room ", room);
    });

    socket.on("message", (payload) => {
        const { room } = payload;
        if (room) {
            io.to(room).emit("message", { ...payload, from: socket.id });
            console.log(`message sent to room ${room} : `, payload);
        } else {
            io.emit("message", { ...payload, from: socket.id });
            console.log("message sent to all : ", payload);
        }
    });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id)
  })

})

server.listen(port, () => {
  console.log(`server running on port ${port}`);

})