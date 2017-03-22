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
          }).then(function(){
            Statut.create({
                  libelle: "Conseiller"
            }).then(function(){
              Statut.create({
                        libelle: "Client"
              }).then(function(){
                Statut.associate(User); // On lie les statuts au utilisateur
                User.sync({force:true}).then(function(){
                    User.associate(Statut);
                    //Creation données de test. Possibilité de les mettre ailleurs ?
                    User.create({
                      password: 'test',
                      nom: 'Administrateur',
                      prenom: 'Test',
                      email: "admin@gmail.com",
                      statutId:1
                    }).then(function(){
                      User.create({
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
          })
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
app.get('/logout', controller.logout);
app.post('/auth', controller.auth);
app.post('/register', controller.register);
app.get('/admin', controller.admin);
app.get('/admin/gestionnaire', controller.admin);
app.get('/admin/historique', controller.admin);
app.get('/conseiller', controller.conseiller);
app.get('/conseiller/historique', controller.conseiller);
app.get('/conseiller/chat/:id', controller.conseiller);


app.get('/views/conseiller/compte.html', (req, res) => {
  res.sendfile('./public/conseiller/moncompte.html');
});
app.get('/views/conseiller/historique.html', (req, res) => {
  res.sendfile('./public/conseiller/historique.html');
});
app.get('/views/conseiller/chat.html', (req, res) => {
  res.sendfile('./public/conseiller/chat.html');
});
app.get('/views/admin/compte.html', (req, res) => {
  res.sendfile('./public/administration/moncompte.html');
});
app.get('/views/admin/gestionnaire.html', (req, res) => {
  res.sendfile('./public/administration/gestionnaire.html');
});
app.get('/views/admin/historique.html', (req, res) => {
  res.sendfile('./public/administration/historique.html');
});

app.use(controller.error);

// Initialisation du port d'écoute.
app.listen(8080);
