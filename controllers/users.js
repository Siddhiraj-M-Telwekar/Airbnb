const User = require("../Model/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("Users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
   let {username,email,password}=req.body;
   const newUser = new User({email,username});
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success","Welcome to wanderlust");
   res.redirect("/listings");
   })
   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to wanderlust.You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}