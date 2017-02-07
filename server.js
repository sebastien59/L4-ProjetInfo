let express = require("express");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let Sequelize = require('sequelize');
let controller = require('./app/controllers.js');
let database = require('./config/database.js');
let bodyParser = require('body-parser');
var authMiddleware = require('./app/middleware/auth.js');

let app=express();

let User = require('./app/models/user.js')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: '3H8KzqnvBCYqfA49nb7MWvv6kE2685U5',
  resave: true,
  saveUninitialized:false
}));

/* middleware*/
app.use('/admin', authMiddleware);

app.use('/', express.static('public'));

/* routes */
app.get('/', controller.index);
app.get('/login', controller.login);
app.post('/auth', controller.auth);
app.post('/register', controller.register);
app.get('/admin', controller.admin);

app.listen(8080)
