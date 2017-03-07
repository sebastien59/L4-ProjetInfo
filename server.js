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

// Importation du model User
let Statut = require('./app/models/statut.js');
let User = require('./app/models/user.js');

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev principalement.
*/
database.sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
    .then(function(results) {
        Statut.sync({force:true}).then(function(){
          Statut.create({
            libelle: "Administrateur"
          })
          Statut.create({
                libelle: "Conseiller"
          })
          Statut.create({
                    libelle: "Client"
          }).then(function(){
            Statut.associate(User); // On lie les statuts au utilisateur
            User.sync({force:true}).then(function(){
                User.associate(Statut);
                //Creation données de test. Possibilité de les mettre ailleurs ?
                User.create({
                  login: 'admin',
                  password: 'test',
                  nom: 'Administrateur',
                  prenom: 'Test',
                  email: "admin@gmail.com",
                  statutId:1
                }).then(function(){
                  User.create({
                    login: 'conseiller',
                    password: 'test',
                    nom: 'Conseiller',
                    prenom: 'Test',
                    email: "merchez.sebastien@gmail.com",
                    statutId: 2
                  });
                });
            });
          });
        });
});



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
app.listen(8080);
