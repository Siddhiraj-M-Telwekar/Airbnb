const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
})

userSchema.plugin(passportLocalMongoose);  //this code automatically implement username,hash and salting. 

module.exports=mongoose.model("User",userSchema);