const ESRB = require("../models/ESRB")
const VideoGame = require("../models/videogame")
const asyncHandler = require("express-async-handler")

// Display list of all companies.
  exports.esrb_list = asyncHandler(async (req, res, next) => {
    const ESRBList = await ESRB.find({}, "name").exec()

    res.render("esrb_list", { title: "List of registered ESRB age ratings", esrb_list: ESRBList })
  });
  
  // Display detail page for a specific esrb.
  exports.esrb_detail = asyncHandler(async (req, res, next) => {
    const [esrb, gamesByAgeRating] = await Promise.all([
      ESRB.findById(req.params.id).exec(),
      VideoGame.find({ ESRB: req.params.id }, "name").sort({name: 1}).exec(),
    ]);

    if (esrb === null) {
      const err = new Error("Rating not found")
      err.status('404')
      return next(err);
    }

    res.render("esrb_detail", {
      title: esrb.name,
      rating: esrb,
      games_by_age_rating: gamesByAgeRating,
    }) 
  });
  
  // Display esrb create form on GET.
  exports.esrb_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb create GET");
  });
  
  // Handle esrb create on POST.
  exports.esrb_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb create POST");
  });
  
  // Display esrb delete form on GET.
  exports.esrb_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb delete GET");
  });
  
  // Handle esrb delete on POST.
  exports.esrb_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb delete POST");
  });
  
  // Display esrb update form on GET.
  exports.esrb_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update GET");
  });
  
  // Handle esrb update on POST.
  exports.esrb_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update POST");
  });