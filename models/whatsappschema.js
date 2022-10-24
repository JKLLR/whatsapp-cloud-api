const mongoose = require('mongoose');

const whatsappschema = new mongoose.Schema({
    id: String,
    author_id: String,
    text: String
})

const Whatsappschema = mongoose.model("whatsapp", whatsappschema)
module.exports.Whatsappschema = Whatsappschema