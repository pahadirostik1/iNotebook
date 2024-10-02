const mongoose= require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/mydatabase";
const connectToMongo=async()=>{
    try {
        await mongoose.connect(mongoURI); 
        console.log("Connected to Mongo successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:");
        process.exit(0);
    }
};

module.exports=connectToMongo;