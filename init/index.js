const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Model/listing.js");

const Mongo_Url= 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_Url);
}

const initDb = async()=>{
    await Listing.deleteMany();
    initData.data = initData.data.map((obj)=>({...obj,owner:'67a5a8839abc62fe0a433b22'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();
