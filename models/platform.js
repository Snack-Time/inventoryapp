const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
    name: { type: String, required: true, maxLength: 100},
    release_date: { type: Date },
    developer: { type: Schema.Types.ObjectId, ref: "Company", required: true},
})

PlatformSchema.virtual("url").get(function () {
    return `/catalog/platform/${this._id}`;
});

PlatformSchema.virtual("release_date_formatted").get(function () {
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
})

module.exports = mongoose.model("Platform", PlatformSchema);