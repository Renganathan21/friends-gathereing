import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";

import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const databaseUrl = "mongodb+srv://sathishsatish2002:3T9ashSQUpm3z5pV@cluster0.r3stg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(
    cors(
        {
            origin:"http://192.168.1.10:5173/",
            credentials:true    ,
            methods:[
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",

            ]
        }
    )
)


app.use("/uploads/profiles/",express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.join(__dirname, '/client/dist')));

console.log(__dirname)
app.get(
    "*",(req,res)=> res.sendFile(path.join(__dirname, '/client/dist/index.html'))
)

app.use('/api/auth',authRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

app.use("/api/contacts", contactsRoutes);


const server = app.listen(port,()=>{
    console.log("hello",port)
})

setupSocket(server);

mongoose.connect(databaseUrl).then(
    ()=>{
        console.log("connection sucess")
    }
).catch(
    (e)=>{
        console.log(e)
    }
)
