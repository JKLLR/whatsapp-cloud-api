const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();
const MONGODB = "mongodb+srv://jeffhuria:Sb6MjorStlnGBM5U@cluster0.otvab5k.mongodb.net/?retryWrites=true&w=majority";

// const mysql = require("mysql");

// create connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "12345678",
//     database: "whatsapp_api",

// });

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("Mysql Connected...");

// });

const mongoose = require("mongoose");

const { Whatsappschema } = require('./models/whatsappschema')
const db = async () => {
    try {
        await mongoose.connect(MONGODB);
        console.log("Mongo Connected...");
    } catch (error) {
        console.log(error);
    }
}

db()


const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;


app.listen( process.env.PORT, () => {
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side(cloud api side)
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {
        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }

});

app.post("/webhook", async(req, res) => {

    let body_param = req.body;

    console.log("anime titties");
    console.log(JSON.stringify(body_param, null, 2));
    const whatsappobj = {
        id: JSON.stringify(body_param, null, 2)["entry"][0].id,
        id: JSON.stringify(body_param, null, 2)["entry"][0]["changes"][0]["value"].metadata.display_phone_number
    }
    // const tweet = TweetSchema(tweetobj)
    const whatsapp = users(whatsappobj)
    await whatsapp.save()
    console.log({ json })
    console.log("saved text");

    if (body_param.object) {
        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number " + phone_no_id);
            console.log("from " + from);
            console.log("body param " + msg_body);

            // Send a POST request
            axios({
                method: 'post',
                url: 'https://graph.facebook.com/v14.0/' + phone_no_id + '/messages?access_token=' + token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "recieved"
                    }
                },

                headers: { "Content-Type": "application/json" }


            });

            res.sendStatus(200);
        } else {
            // Return a '404 Not Found' if event is not from a WhatsApp API
            res.sendStatus(404);
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).send("hello this is running");
});