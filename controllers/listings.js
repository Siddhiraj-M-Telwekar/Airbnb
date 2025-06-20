const Listing= require("../Model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    
    res.render("listings/new.ejs");
}

module.exports.showListings=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).
    populate({
        path:"reviews",
    populate:{
        path:"author"
    },
    }).
    populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    
}

module.exports.createListings=async (req,res)=>{
    // let {title,description,image,price,location,Country} = req.body;
   // let listing = req.body.listing;
   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();
   console.log(response.body.features[0].geometry);
   res.send("done"); 

   let url = req.file.path;
   let filname = req.file.filname;
//    let result = listingSchema.validate(req.body);
//    console.log(result);
//     if(result.error){
//         throw new ExpressError(400, error);
//     }
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = {url,filname};
   newListing.geometry=response.body.features[0].geometry;
   await newListing.save(); 
   req.flash("success","new listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    let newurl=originalImageUrl.replace("/upload","/upload/h_300,w_300/e_blur:1000");

    res.render("listings/edit.ejs",{listing,newurl});
}

module.exports.updateListings = async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof(req.file) !== "undefined"){
    let url = req.file.path;
   let filname = req.file.filname;
   listing.image = {url,filname};
   await listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async(req,res)=>{
    let {id}= req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing deleted");
    res.redirect("/listings");
}