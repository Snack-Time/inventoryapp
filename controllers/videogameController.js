const VideoGame = require("../models/videogame");
const Company = require("../models/company");
const Platform = require("../models/platform");
const Genre = require("../models/genre");
const ESRB = require("../models/ESRB");
const GameInstances = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numGames,
    numCompanies,
    numPlatforms,
    numGenres,
    numESRB,
    numGameInstances,
    numAvailableGameInstances,
  ] = await Promise.all([
    VideoGame.countDocuments({}).exec(),
    Company.countDocuments({}).exec(),
    Platform.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
    ESRB.countDocuments({}).exec(),
    GameInstances.countDocuments({}).exec(),
    GameInstances.countDocuments({ status: "Available" }).exec(),
  ]);

  res.render("index", {
    title: "Video Game Inventory Database Editor",
    game_count: numGames,
    company_count: numCompanies,
    platform_count: numPlatforms,
    genre_count: numGenres,
    game_instance_count: numGameInstances,
    game_instance_available_count: numAvailableGameInstances,
    rating_count: numESRB,
  });
});

// Display list of all videogames.
exports.videogame_list = asyncHandler(async (req, res, next) => {
  const videoGameList = await VideoGame.find({}, "name developer publisher")
    .sort({ name: 1 })
    .populate("developer")
    .populate("publisher")
    .exec();

    res.render("game_list", { title: "List of Video Games in Database", game_list: videoGameList })
});

// Display detail page for a specific videogame.
exports.videogame_detail = asyncHandler(async (req, res, next) => {
  const [game, gameInstances] = await Promise.all([
    VideoGame.findById(req.params.id).populate("developer").populate("publisher").populate("platform").populate("ESRB").populate("genre").exec(),
    GameInstances.find({ videogame: req.params.id }).populate("videogame").populate("platform").exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found")
    err.status(404)
    return next(err);
  }

  res.render("game_detail", {
    title: game.name,
    game: game,
    game_instances: gameInstances,
  });
});

// Display videogame create form on GET.
exports.videogame_create_get = asyncHandler(async (req, res, next) => {
  const [allCompanies, allGenres, allPlatforms, allRatings] = await Promise.all([
    Company.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
    Platform.find().sort({ name: 1 }).exec(),
    ESRB.find().sort({ name: 1 }).exec(),
  ]);

  res.render('game_form', {
    title: 'Create Video Game',
    companies: allCompanies,
    genres: allGenres,
    platforms: allPlatforms,
    ratings: allRatings,
  })
});

// Handle videogame create on POST.
exports.videogame_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body.platform)) {
      req.body.platform =
        typeof req.body.platform === "undefined" ? [] : [req.body.platform];
    }
    next();
  },


  body('name', 'Platform name must be less than 100 characters. (Why are you trying to do that anyway???)')
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('ESRB', 'Age Rating error')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('release_date', 'Release Date Error')
    .optional( {values: "falsy"})
    .isISO8601()
    .toDate()
    .escape(),
  body('developer', 'Pick a valid developer')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('publisher', 'Pick a valid publisher')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('platform.*').escape(),
  body('genre.*').escape(),
  body('desc', 'Description required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const game = new VideoGame({
      name: req.body.name,
      ESRB: req.body.ESRB,
      release_date: req.body.release_date,
      developer: req.body.developer,
      publisher: req.body.publisher,
      platform: req.body.platform,
      genre: req.body.genre,
      desc: req.body.desc,
    })

    if(!errors.isEmpty()) {
      const [allCompanies, allGenres, allPlatforms, allRatings] = await Promise.all([
        Company.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
        Platform.find().sort({ name: 1 }).exec(),
        ESRB.find().sort({ name: 1 }).exec(),
      ])

      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      for (const platform of allPlatforms) {
        if (game.platform.includes(platform._id)) {
          platform.checked = "true";
        }
      }

      res.render('game_form', {
        title: 'Create Video Game',
        companies: allCompanies,
        genres: allGenres,
        platforms: allPlatforms,
        ratings: allRatings,
        game: game,
        errors: errors.array(),
      })
    }

    else {
      await game.save();
      res.redirect(game.url);
    }
})]

// Display videogame delete form on GET.
exports.videogame_delete_get = asyncHandler(async (req, res, next) => {
  const [game, allGameInstances] = await Promise.all([
    VideoGame.findById(req.params.id).exec(),
    GameInstances.find( { videogame: req.params.id }, "storeid").exec()
  ])

  if (game === null) {
    res.redirect('/catalog/videogames')
  }

  res.render("game_delete", {
    title: "Delete Game",
    game: game,
    game_copies: allGameInstances,
  })
});

// Handle videogame delete on POST.
exports.videogame_delete_post = asyncHandler(async (req, res, next) => {
  const [game, allGameInstances] = await Promise.all([
    VideoGame.findById(req.params.id).exec(),
    GameInstances.find( { videogame: req.params.id }, "storeid").exec()
  ])

  if (allGameInstances.length > 0) {
    res.render("game_delete", {
      title: "Delete Game",
      game: game,
      game_copies: allGameInstances,
    })
    return
  }
  else {
    await VideoGame.findByIdAndDelete(req.body.gameid);
    res.redirect('/catalog/videogames')
  }    
});

// Display videogame update form on GET.
exports.videogame_update_get = asyncHandler(async (req, res, next) => {
  const [game, allCompanies, allGenres, allPlatforms, allRatings] = await Promise.all([
    VideoGame.findById(req.params.id).populate('name').populate('ESRB').populate('developer').populate('publisher').populate('platform').populate('genre').exec(),
    Company.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
    Platform.find().sort({ name: 1 }).exec(),
    ESRB.find().sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found")
    err.status = 404
    return next(err)
  }

  res.render('game_form', {
    title: `Update ${game.name}`,
    companies: allCompanies,
    genres: allGenres,
    platforms: allPlatforms,
    ratings: allRatings,
    game: game,
  })
});

// Handle videogame update on POST.
exports.videogame_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body.platform)) {
      req.body.platform =
        typeof req.body.platform === "undefined" ? [] : [req.body.platform];
    }
    next();
  },


  body('name', 'Platform name must be less than 100 characters. (Why are you trying to do that anyway???)')
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('ESRB', 'Age Rating error')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('release_date', 'Release Date Error')
    .optional( {values: "falsy"})
    .isISO8601()
    .toDate()
    .escape(),
  body('developer', 'Pick a valid developer')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('publisher', 'Pick a valid publisher')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('platform.*').escape(),
  body('genre.*').escape(),
  body('desc', 'Description required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const game = new VideoGame({
      name: req.body.name,
      ESRB: req.body.ESRB,
      release_date: req.body.release_date,
      developer: req.body.developer,
      publisher: req.body.publisher,
      platform: typeof req.body.platform === "undefined" ? [] : req.body.platform,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      desc: req.body.desc,
      _id: req.params.id,
    })

    if(!errors.isEmpty()) {
      const [allCompanies, allGenres, allPlatforms, allRatings] = await Promise.all([
        Company.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
        Platform.find().sort({ name: 1 }).exec(),
        ESRB.find().sort({ name: 1 }).exec(),
      ])

      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      for (const platform of allPlatforms) {
        if (game.platform.includes(platform._id)) {
          platform.checked = "true";
        }
      }

      res.render('game_form', {
        title: 'Create Video Game',
        companies: allCompanies,
        genres: allGenres,
        platforms: allPlatforms,
        ratings: allRatings,
        game: game,
        errors: errors.array(),
      })
      return
    }

    else {
      const updatedGame = await VideoGame.findByIdAndUpdate(req.params.id, game, {})
      res.redirect(updatedGame.url);
    }
})]