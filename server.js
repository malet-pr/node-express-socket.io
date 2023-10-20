require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = process.env.MONGO_URI;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const Message = mongoose.model('Message', new Schema({ name: String, message: String }));

app.get('/messages', async (req,res) => {
    try{
        const docs = await Message.find({});
        res.status(200).send(docs);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } 
});

app.post('/messages', async (req,res) => { 
    try{
        await Message.create(req.body);
        io.emit('message',req.body);
        res.sendStatus(200);
    } catch {
        log.error;
        res.sendStatus(500);
    } 
});

// Log server, db connection and socket.io

server.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
})

mongoose.connect(uri)
    .then(console.log('Connected successfully to mongodb'))
    .catch(console.error);

io.on('connection', (socket) => {
    console.log('user connected');
})

