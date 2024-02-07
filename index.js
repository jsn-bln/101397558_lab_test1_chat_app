const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();


const port = process.env.PORT || 8080;
const uri = process.env.URI;


mongoose.connect(uri);
const db = mongoose.connection;
db.once('open', () => {console.log('Status: connected to database!');});


const app = express();




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

