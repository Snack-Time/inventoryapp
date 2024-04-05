const VideoGame = require("../models/videogame");
const Company = require("../models/company");
const Platform = require("../models/platform");
const Genre = require("../models/genre");
const ESRB = require("../models/ESRB");
const GameInstances = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");

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
  const videoGameList = await VideoGame.find({}, "name developer")
    .sort({ name: 1 })
    .populate("developer")
    .exec();

    res.render("game_list", { title: "List of Video Games in Database", game_list: videoGameList })
});

// Display detail page for a specific videogame.
exports.videogame_detail = asyncHandler(async (req, res, next) => {
  const [game, gameInstances] = await Promise.all([
    VideoGame.findById(req.params.id).populate("developer").populate("publisher").populate("platform").populate("ESRB").populate("genre").exec(),
    GameInstances.find({ game: req.params.id }).exec(),
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
  res.send("NOT IMPLEMENTED: videogame create GET");
});

// Handle videogame create on POST.
exports.videogame_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame create POST");
});

// Display videogame delete form on GET.
exports.videogame_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame delete GET");
});

// Handle videogame delete on POST.
exports.videogame_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame delete POST");
});

// Display videogame update form on GET.
exports.videogame_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame update GET");
});

// Handle videogame update on POST.
exports.videogame_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame update POST");
});
