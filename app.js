if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
// console.log(process.env.SECRET);

const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_Url= 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("./Model/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./schema.js");
const Review = require("./Model/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");

const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_Url);
    }

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"./views")); 
app.use(express.urlencoded({extended:true}));  
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

// app.get("/",(req,res)=>{
//     res.send("root is working");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeuser= new User({
        email:"siddhi@gmail.com",
        username:"siddhi",
    })

   let registeredUser = await User.register(fakeuser,"siddhi");
   console.log(registeredUser);
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);





// app.get("/testlisting", async(req,res)=>{
//     let samplelisting = new Listing({
//         title: "My new villa",
//         description: "by the beach",
//         price:1200,
//         location : "calangute,Goa",
//         Country: "India",
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
   // res.status(statusCode).send(message);
})

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
})
