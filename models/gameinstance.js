const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  videogame: { type: Schema.Types.ObjectId, ref: "Video Game", required: true },
  storeid: { type: String, required: true },
  platform: { type: Schema.Types.ObjectId, ref: "Platform", required: true},
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

GameInstanceSchema.virtual("url").get(function () {
  return `/catalog/gameinstance/${this._id}`;
});

module.exports = mongoose.model("GameInstance", GameInstanceSchema);
