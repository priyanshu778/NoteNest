import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import connectToMongoDB from './db/db.js'

import authRoute from './routes/auth.js'
import noteRouter from './routes/note.js'



const app=express()
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/note', noteRouter);

 


app.listen(5000,()=>{
    connectToMongoDB()
    console.log("Server is Running on Port 5000");
})