const ESRB = require("../models/ESRB")
const VideoGame = require("../models/videogame")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

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
    res.render("esrb_form", { title: "Create Rating" })
  });
  
  // Handle esrb create on POST.
  exports.esrb_create_post = [
    body('name', 'Rating name must be at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
    body('acronym', 'Rating acronym must be between 1 to 3 characters')
    .trim()
    .isLength({ max: 3, min: 1 })
    .escape(),
    body('desc', 'Description must be at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const esrb = new ESRB({ name: req.body.name, acronym: req.body.acronym, desc: req.body.desc });

      if (!errors.isEmpty()) {
        res.render("esrb_form", {
          title: "Create Rating",
          esrb: esrb,
          errors: errors.array(),
        });
        return
      } 
      else {
        const ratingExists = await ESRB.findOne({ name: req.body.name }).collation({ locale: "en", strength: 2 }).exec()
        if (ratingExists) {
          res.redirect(ratingExists.url);
        }
        else {
          await esrb.save();
          res.redirect(esrb.url)
        }
      }
    }),
  ]
  
  // Display esrb delete form on GET.
  exports.esrb_delete_get = asyncHandler(async (req, res, next) => {
    const [esrb, gamesRated] = await Promise.all([
      ESRB.findById(req.params.id).exec(),
      VideoGame.find( { ESRB: req.params.id }, "name").exec(),
    ]);
  
    if (esrb === null) {
      res.redirect('/catalog/ESRBRatings');
    }
  
    res.render("esrb_delete", {
      title: "Delete Rating",
      esrb: esrb,
      games_with_rating: gamesRated,
    })
  });
  
  // Handle esrb delete on POST.
  exports.esrb_delete_post = asyncHandler(async (req, res, next) => {
    const [esrb, gamesRated] = await Promise.all([
      ESRB.findById(req.params.id).exec(),
      VideoGame.find( { ESRB: req.params.id }, "name").exec(),
    ]);

    if (gamesRated.length > 0) {
      res.render("esrb_delete", {
        title: "Delete Rating",
        esrb: esrb,
        games_with_rating: gamesRated,
      });
      return;
    }
    else {
      await ESRB.findByIdAndDelete(req.body.ratingid);
      res.redirect('/catalog/ESRBRatings')
    }    
  });
  
  // Display esrb update form on GET.
  exports.esrb_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update GET");
  });
  
  // Handle esrb update on POST.
  exports.esrb_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update POST");
  });