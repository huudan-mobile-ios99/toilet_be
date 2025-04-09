"use strict";

const mongoose = require('mongoose');
const username = "LeHuuDan99";
const password = "3lyIxDXEzwCtzw2i";
const database = "Toilet";
const database2 = "FeedbackUser";
const URL = `mongodb+srv://${username}:${password}@clustervegas.ym3zd.mongodb.net/${database}?retryWrites=true&w=majority`;
const URL2 = `mongodb+srv://${username}:${password}@clustervegas.ym3zd.mongodb.net/${database2}?retryWrites=true&w=majority`;



// dbConnections.js
function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}


const db1 = makeNewConnection(URL);
const db2 = makeNewConnection(URL2);

module.exports = {
   db1,
   db2
}