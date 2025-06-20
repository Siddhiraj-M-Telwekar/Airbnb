const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../Model/listing.js");
const {isLoggedIn, isOwner,validatelisting} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});

// new route

router.get("/new" ,isLoggedIn, listingController.renderNewForm);

router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn,
     upload.single('listing[image]'),
     validatelisting,
wrapAsync(listingController.createListings));


router.route("/:id").get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner, 
     upload.single('listing[image]'),
     validatelisting,
     wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListings));    

// Index route
//router.get("/", wrapAsync(listingController.index));

// show route
// router.get("/:id" , wrapAsync(listingController.showListings));

// create route
/*router.post("/",validatelisting,
     wrapAsync 
    (listingController.createListings));
*/

// edit route
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// update route
/*router.put("/:id",isLoggedIn,isOwner, validatelisting,
     wrapAsync(listingController.updateListings));
*/

// delete route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListings));

module.exports=router;