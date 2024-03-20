const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
    name: { type: String, required: true, maxLength: 100},
    release_date: { type: Date },
    developer: { type: Schema.Types.ObjectId, ref: "company", required: true},
})

PlatformSchema.virtual("url").get(function () {
    return `/catalog/platform/${this._id}`;
});

module.exports = mongoose.model("Platform", PlatformSchema);