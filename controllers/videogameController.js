const VideoGame = require("../models/videogame");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all videogames.
exports.videogame_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: videogame list");
});

// Display detail page for a specific videogame.
exports.videogame_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: videogame detail: ${req.params.id}`);
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
