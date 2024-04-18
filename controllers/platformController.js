const Platform = require("../models/platform");
const VideoGame = require("../models/videogame");
const Company = require("../models/company");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all platform.
exports.platform_list = asyncHandler(async (req, res, next) => {
  const platformList = await Platform.find({}, "name developer")
    .sort({ name: 1 })
    .populate("developer")
    .exec();

    res.render("platform_list", { title: "List of Platforms in Database", platform_list: platformList })
});

// Display detail page for a specific platform.
exports.platform_detail = asyncHandler(async (req, res, next) => {
  const [platform, gamesOnPlatform] = await Promise.all([
    Platform.findById(req.params.id).populate("developer").exec(),
    VideoGame.find({ platform: req.params.id }, "name").sort({ name: 1}).exec(),
  ])

  if (platform === null) {
    const err = new Error("Platform not found")
    err.status(404)
    return next(err);
  }

  res.render("platform_detail", {
    title: platform.name,
    platform: platform,
    games_on_platform: gamesOnPlatform,
  })
});

// Display platform create form on GET.
exports.platform_create_get = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Company.find().sort({ name: 1 }).exec()

  res.render("platform_form", {
    title: "Create Platform",
    developers: allDevelopers,
  })
});

// Handle platform create on POST.
exports.platform_create_post = [
  body('name', 'Platform name must be less than 100 characters. (Why are you trying to do that anyway???)')
  .trim()
  .isLength({ max: 100 })
  .escape(),
  body('release_date', 'Release Date Error')
  .optional( {values: "falsy"})
  .isISO8601()
  .toDate()
  .escape(),
  body('developer', 'Pick a valid company')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const platform = new Platform({ name: req.body.name, release_date: req.body.release_date, developer: req.body.developer });

    if (!errors.isEmpty()) {
      const allDevelopers = await Company.find().sort({ name: 1 }).exec()

      res.render("platform_form", {
        title: "Create Platform",
        platform: platform,
        developers: allDevelopers,
        errors: errors.array(),
      });
      return
    } 
    else {
      const platformExists = await Platform.findOne({ name: req.body.name }).collation({ locale: "en", strength: 2 }).exec()
      if (platformExists) {
        res.redirect(platformExists.url);
      }
      else {
        await platform.save();
        res.redirect(platform.url)
      }
    }
  }),
];

// Display platform delete form on GET.
exports.platform_delete_get = asyncHandler(async (req, res, next) => {
  const [platform, gamesOnPlatform] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    VideoGame.find( { platform: req.params.id }, "name").exec(),
  ]);

  if (platform === null) {
    res.redirect('/catalog/platforms');
  }

  res.render("platform_delete", {
    title: "Delete Platform",
    platform: platform,
    games_on_platform: gamesOnPlatform,
  })
});

// Handle platform delete on POST.
exports.platform_delete_post = asyncHandler(async (req, res, next) => {
  const [platform, gamesOnPlatform] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    VideoGame.find( { platform: req.params.id }, "name").exec(),
  ]);

  if (gamesOnPlatform.length > 0) {
    res.render("platform_delete", {
      title: "Delete Platform",
      platform: platform,
      games_on_platform: gamesOnPlatform,
    })
    return;
  }
  else {
    await Platform.findByIdAndDelete(req.body.platformid);
    res.redirect('/catalog/platforms')
  }    
});

// Display platform update form on GET.
exports.platform_update_get = asyncHandler(async (req, res, next) => {
  const platform = await Platform.findById(req.params.id).populate('developer').populate('name').populate('release_date').exec()
  const allDevelopers = await Company.find().sort({ name: 1 }).exec()

  if (platform === null) {
    const err = new Error("Platform not found")
    err.status = 404
    return next(err)
  }

  res.render("platform_form", { title: `Update ${platform.name}`, platform: platform, developers: allDevelopers })
});

// Handle platform update on POST.
exports.platform_update_post = [
  body('name', 'Platform name must be less than 100 characters. (Why are you trying to do that anyway???)')
  .trim()
  .isLength({ max: 100 })
  .escape(),
  body('release_date', 'Release Date Error')
  .optional( {values: "falsy"})
  .isISO8601()
  .toDate()
  .escape(),
  body('developer', 'Pick a valid company')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const platform = new Platform({ name: req.body.name, release_date: req.body.release_date, developer: req.body.developer, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("platform_form", {
        title: `Update ${platform.name}`,
        platform: platform,
        developers: allDevelopers,
        errors: errors.array(),
      });
      return
    } 
    else {
      await Platform.findByIdAndUpdate(req.params.id, platform);
      res.redirect(platform.url)
    }
  }),
];