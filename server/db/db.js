import mongoose from "mongoose";

const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongo Db Connnected");
    }catch(err){
        console.log("Something wrong not connected with DB", err.message);
    }
};

export default connectToMongoDB;

