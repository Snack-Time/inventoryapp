const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const VideoGameSchema = new Schema({
    name: { type: String, required: true, maxLength: 100},
    ESRB: { type: Schema.Types.ObjectId, ref: "ESRB" },
    release_date: { type: Date },
    developer: { type: Schema.Types.ObjectId, ref: "Company", required: true},
    publisher: { type: Schema.Types.ObjectId, ref: "Company", required: true},
    platform: [{ type: Schema.Types.ObjectId, ref: "Platform", required: true}],
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre", required: true}],
    desc: { type: String, required: true},
})

VideoGameSchema.virtual("url").get(function () {
    return `/catalog/videogame/${this._id}`;
});

VideoGameSchema.virtual("release_date_formatted").get(function () {
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
})

module.exports = mongoose.model("VideoGame", VideoGameSchema);