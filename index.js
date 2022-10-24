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
        id: JSON.stringify(body_param, null, 2).entry[0].id,
        id: JSON.stringify(body_param, null, 2).entry[0]["changes"][0]["value"].metadata.display_phone_number
    }

    // anime titties
    // 2022-10-24T20:54:56.492234+00:00 app[web.1]: {
    // 2022-10-24T20:54:56.492234+00:00 app[web.1]:   "object": "whatsapp_business_account",
    // 2022-10-24T20:54:56.492235+00:00 app[web.1]:   "entry": [
    // 2022-10-24T20:54:56.492235+00:00 app[web.1]:     {
    // 2022-10-24T20:54:56.492235+00:00 app[web.1]:       "id": "103597725875995",
    // 2022-10-24T20:54:56.492236+00:00 app[web.1]:       "changes": [
    // 2022-10-24T20:54:56.492236+00:00 app[web.1]:         {
    // 2022-10-24T20:54:56.492236+00:00 app[web.1]:           "value": {
    // 2022-10-24T20:54:56.492236+00:00 app[web.1]:             "messaging_product": "whatsapp",
    // 2022-10-24T20:54:56.492237+00:00 app[web.1]:             "metadata": {
    // 2022-10-24T20:54:56.492237+00:00 app[web.1]:               "display_phone_number": "254771459075",
    // 2022-10-24T20:54:56.492237+00:00 app[web.1]:               "phone_number_id": "102368222669265"
    // 2022-10-24T20:54:56.492237+00:00 app[web.1]:             },
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:             "contacts": [
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:               {
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:                 "profile": {
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:                   "name": "Sam"
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:                 },
    // 2022-10-24T20:54:56.492238+00:00 app[web.1]:                 "wa_id": "254713847445"
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:               }
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:             ],
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:             "messages": [
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:               {
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:                 "from": "254713847445",
    // 2022-10-24T20:54:56.492239+00:00 app[web.1]:                 "id": "wamid.HBgMMjU0NzEzODQ3NDQ1FQIAEhgUM0VCMDEyNzYyQUQ5N0UwOTUxNjEA",
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:                 "timestamp": "1666644894",
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:                 "text": {
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:                   "body": "k"
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:                 },
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:                 "type": "text"
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:               }
    // 2022-10-24T20:54:56.492240+00:00 app[web.1]:             ]
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:           },
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:           "field": "messages"
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:         }
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:       ]
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:     }
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]:   ]
    // 2022-10-24T20:54:56.492241+00:00 app[web.1]: }
    // 2022-10-24T20:54:56.494081+00:00 app[web.1]: /app/index.js:75
    // 2022-10-24T20:54:56.494082+00:00 app[web.1]:         id: JSON.stringify(body_param, null, 2)["entry"][0].id,

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