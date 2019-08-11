const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const apiRoutes = require('./routes/api-routes');
const bodyParser = require('body-parser');
const config = require('./config');
const redisClient = redis.createClient(config.RedisHostUrl, { no_ready_check: true, auth_pass: config.RedisPassword});
//const redisLocalClient = redis.createClient();

//App Instance
const app = new express();

//App Session
app.use(session({
    secret: config.SECRET,
    name: 'accessToken',
    // create new redis store.
    //store: new redisStore({ host: '127.0.0.1',port: 6379, client: redisLocalClient, ttl :  86400 }),
    store: new redisStore({ host: config.RedisHostUrl, client: redisClient, ttl :  86400 }),
    saveUninitialized: true,
    resave: false,
    cookie: { originalMaxAge: config.MaxTokenAge, secure: false }
}))

redisClient.on('connect', ()=>{
    console.log('Redis client connected');
});
redisClient.on('error', (err)=>{
    console.log('Connection to reddis client failed -' + err);
});

//App mongoose client instance connection
mongoose.Promise = global.Promise;
const dbConString = config.MongoDBURI;
mongoose.connect(dbConString, {useNewUrlParser: true, useCreateIndex: true})
    .then(db=> console.log("DB Connnection established!."))
    .catch("Error establishing connection to database");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//App Routes
app.use('/api', apiRoutes);
    

//App PORT
const port = config.PORT || 3000;
app.listen(port, () => {
    console.log(`Application listening on port ` + port);
})