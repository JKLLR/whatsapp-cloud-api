const mongoose = require('mongoose');

const whatsappschema = new mongoose.Schema({
    id: String,
    from: String,
    text: String
})

const Whatsappschema = mongoose.model("whatsapp", whatsappschema)
module.exports.Whatsappschema = Whatsappschema