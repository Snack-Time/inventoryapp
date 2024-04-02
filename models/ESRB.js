const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ESRBSchema = new Schema({
    name: { type: String, required: true, maxLength: 100},
    acronym: { type: String, required: true, maxLength: 3},
    desc: { type: String, required: true},
})

ESRBSchema.virtual("url").get(function () {
    return `/catalog/ESRB/${this._id}`;
});

module.exports = mongoose.model("ESRB", ESRBSchema);