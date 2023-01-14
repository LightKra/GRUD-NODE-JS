const mongoose = require("mongoose");
const connectionMongoDb = async ()=>{
    try{
        console.log("connected success mongoose");
        await mongoose.connect("mongodb://localhost:27017/appPrueba");
    }catch(error){
        console.log("error connection")
        console.log(error);
    }   
}

module.exports = {connectionMongoDb, mongoose}