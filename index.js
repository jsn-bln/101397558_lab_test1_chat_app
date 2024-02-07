const express = require('express');
const mongoose = require('mongoose');
const { server } = require('socket.io')
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const port = process.env.PORT || 8080;
const uri = process.env.URI;


mongoose.connect(uri);
const db = mongoose.connection;
db.once('open', () => {console.log('Status: connected to database!');});


const app = express();
app.use(cors());
app.use(express.json());


app.use("/",userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

