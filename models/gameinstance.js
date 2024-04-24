const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  videogame: { type: Schema.Types.ObjectId, ref: "VideoGame", required: true },
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

GameInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

GameInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); 
});

module.exports = mongoose.model("GameInstance", GameInstanceSchema);
