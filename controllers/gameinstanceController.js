const GameInstance = require("../models/gameinstance");
const VideoGame = require('../models/videogame');
const Platform = require('../models/platform')
const asyncHandler = require("express-async-handler");

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
  res.send("NOT IMPLEMENTED: gameinstance create GET");
});

// Handle gameinstance create on POST.
exports.gameinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gameinstance create POST");
});

// Display gameinstance delete form on GET.
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gameinstance delete GET");
});

// Handle gameinstance delete on POST.
exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gameinstance delete POST");
});

// Display gameinstance update form on GET.
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gameinstance update GET");
});

// Handle gameinstance update on POST.
exports.gameinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gameinstance update POST");
});
