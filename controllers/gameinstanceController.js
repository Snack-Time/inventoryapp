const GameInstance = require("../models/gameinstance");
const VideoGame = require('../models/videogame');
const Platform = require('../models/platform');

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display list of all gameinstances.
exports.gameinstance_list = asyncHandler(async (req, res, next) => {
  const allGameInstances = await GameInstance.find().populate("videogame").populate("platform").sort({storeid: 1}).exec();
  
  res.render("gameinstance_list", {
    title: "List of Store Database Registered Game Copies",
    gameinstance_list: allGameInstances,
  });
});

// Display detail page for a specific gameinstance.
exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  const gameInstance = await GameInstance.findById(req.params.id)
  .populate("videogame")
  .populate("platform")
  .exec();

  if (gameInstance === null) {
    // No results.
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
}

  res.render("gameinstance_detail", {
    title: "Game:",
    gameinstance: gameInstance,
  });
  });

// Display gameinstance create form on GET.
exports.gameinstance_create_get = asyncHandler(async (req, res, next) => {
  const allGames = await VideoGame.find({}, "name platform").sort({ name: 1 }).populate("platform").exec()
  const allPlatforms = await Platform.find({}, "name").sort({ name: 1 }).exec()
  
  res.render('gameinstance_form', {
    title: "Create Game Copy",
    game_list: allGames,
    platform_list: allPlatforms,
  })

  });
// Handle gameinstance create on POST.
exports.gameinstance_create_post = [
  body('videogame', 'Please select a game.').trim().isLength({ min: 1 }).escape(),
  body('platform')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, { req }) => {
      const game = await VideoGame.findById(req.body.videogame).exec()
      if (game.platform.includes(value) === false) {
        throw new Error('Game not made for selected platform.')
      }
    })
    .escape(),
  body('storeid', 'Please input a valid ID with at least 3 characters.').trim().isLength({ min: 3 }).escape(),
  body('due_back', 'Invalid date.').optional({values: "falsy"}).isISO8601().toDate(),
  body('status').escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const gameInstance = new GameInstance({
      videogame: req.body.videogame,
      platform: req.body.platform,
      storeid: req.body.storeid,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    })

    if(!errors.isEmpty()) {
      const allGames = await VideoGame.find({}, "name platform").sort({ name: 1 }).populate("platform").exec()
      const allPlatforms = await Platform.find({}, "name").sort({ name: 1 }).exec()
      
      res.render('gameinstance_form', {
        title: "Create Game Copy",
        game_list: allGames,
        platform_list: allPlatforms,
        gameinstance: gameInstance,
        errors: errors.array(),
      })
    }
    else {
      await gameInstance.save();
      res.redirect(gameInstance.url)
    }
  })
];

// Display gameinstance delete form on GET.
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  const gameInstance = await GameInstance.findById(req.params.id).populate('videogame platform').exec();

  if (gameInstance === null) {
    res.redirect('/catalog/gameinstances')
  }
  
  res.render("gameinstance_delete", {
    title: "Delete Game Copy",
    gameinstance: gameInstance,
  });
});

// Handle gameinstance delete on POST.
exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  await GameInstance.findByIdAndDelete(req.body.id);
  res.redirect("/catalog/gameinstances");
});

// Display gameinstance update form on GET.
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  const [gameInstance, allGames, allPlatforms] = await Promise.all([
    GameInstance.findById(req.params.id).populate("videogame platform").exec(),
    VideoGame.find({}, "name platform").sort({ name: 1 }).populate("platform").exec(),
    Platform.find({}, "name").sort({ name: 1 }).exec(),
  ]);

  if (gameInstance === null) {
    // No results.
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_form", {
    title: "Update Game Copy",
    game_list: allGames,
    platform_list: allPlatforms,
    gameinstance: gameInstance,
  });
});

// Handle gameinstance update on POST.
exports.gameinstance_update_post = [
  body('videogame', 'Please select a game.').trim().isLength({ min: 1 }).escape(),
  body('platform')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, { req }) => {
      const game = await VideoGame.findById(req.body.videogame).exec()
      if (game.platform.includes(value) === false) {
        throw new Error('Game not made for selected platform.')
      }
    })
    .escape(),
  body('storeid', 'Please input a valid ID with at least 3 characters.').trim().isLength({ min: 3 }).escape(),
  body('due_back', 'Invalid date.').optional({values: "falsy"}).isISO8601().toDate(),
  body('status').escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const gameInstance = new GameInstance({
      videogame: req.body.videogame,
      platform: req.body.platform,
      storeid: req.body.storeid,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    })

    if(!errors.isEmpty()) {
      const allGames = await VideoGame.find({}, "name platform").sort({ name: 1 }).populate("platform").exec()
      const allPlatforms = await Platform.find({}, "name").sort({ name: 1 }).exec()
      
      res.render('gameinstance_form', {
        title: "Update Game Copy",
        game_list: allGames,
        platform_list: allPlatforms,
        gameinstance: gameInstance,
        errors: errors.array(),
      })
    }
    else {
      await GameInstance.findByIdAndUpdate(req.params.id, gameInstance, {});
      res.redirect(gameInstance.url)
    }
  })
];