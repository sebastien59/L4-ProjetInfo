/**
  Import des modules nécessaires
**/
let express = require("express");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let Sequelize = require('sequelize');
let controller = require('./app/controllers.js');
let database = require('./config/database.js');
let bodyParser = require('body-parser');
var authMiddleware = require('./app/middleware/auth.js');

// initialisation de expressJs
let app=express();

// Importataion du model User
let userstatut = require('./app/models/userstatut.js')
let Statut = require('./app/models/statut.js')
let User = require('./app/models/user.js')

//Creation des associtions
Statut.belongsToMany(User, {through: userstatut});
User.belongsToMany(Statut, {through: userstatut});

// Permet d'utiliser le .body pour récupérer les paramètres des requêtes
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initialisation des cookie et session utiliser pour la connection
app.use(cookieParser());
app.use(session({
  secret: '3H8KzqnvBCYqfA49nb7MWvv6kE2685U5',
  resave: true,
  saveUninitialized:false
}));

// Middleware
app.use('/admin', authMiddleware);
app.use('/conseiller', authMiddleware);

app.use('/', express.static('public'));

// Routes
app.get('/', controller.index);
app.get('/login', controller.login);
app.post('/auth', controller.auth);
app.post('/register', controller.register);
app.get('/admin', controller.admin);
app.get('/conseiller', controller.conseiller);
app.get('/conseiller/resultat', controller.conseiller);
app.get('/conseiller/chat/:id', controller.conseiller);

app.get('/views/compte.html', (req, res) => {
  res.sendfile('./public/conseiller/moncompte.html');
});
app.get('/views/resultat.html', (req, res) => {
  res.sendfile('./public/conseiller/resultat.html');
});
app.get('/views/chat.html', (req, res) => {
  res.sendfile('./public/conseiller/chat.html');
});
// Initialisation du port d'écoute.
app.listen(8080)
