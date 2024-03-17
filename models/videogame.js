const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VideoGameSchema = new Schema({
    name: { type: String, required: true, maxLength: 100},
    ESRB: { type: Schema.Types.ObjectId, ref: "ESRB", required: true},
    release_date: { type: Date },
    developer: { type: Schema.Types.ObjectId, ref: "company", required: true},
    publisher: { type: Schema.Types.ObjectId, ref: "company", required: true},
    platform: [{ type: Schema.Types.ObjectId, ref: "platform", required: true}],
    genre: [{ type: Schema.Types.ObjectId, ref: "genre", required: true}],
    num_of_players: [{ type: String, required: true}],
    desc: { type: String, required: true},
})

VideoGameSchema.virtual("url").get(function () {
    return `/catalog/video-game/${this._id}`;
});