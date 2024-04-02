const mongoose = require("mongoose");

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

module.exports = mongoose.model("VideoGame", VideoGameSchema);