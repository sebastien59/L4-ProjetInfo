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
let Groupe = require('./app/models/groupe.js');
let Entreprise = require('./app/models/entreprise.js');
let Chat = require('./app/models/chat.js');
let Appel = require('./app/models/appel.js');
let Message = require('./app/models/message.js');
let Fichier = require('./app/models/fichier.js');


let User = require('./app/models/user.js');
let Statut = require('./app/models/statut.js');

//Entreprise.drop();

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev principalement.
*/
database.sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
    .then(function(results) {
      Statut.drop();
      User.drop();
      Fichier.sync({force:true}).then(function(){
        Message.sync({force:true}).then(function(){
          Appel.sync({force:true}).then(function(){
            Chat.sync({force:true}).then(function(){
              Entreprise.sync({force:true}).then(function(){
                Groupe.sync({force:true}).then(function(){
                  Groupe.create({
                    intitule: "Retour des commandes",
                    entrepriseId:1
                  }).then(function(){
                      Statut.sync().then(function(){
                        console.log("Statut")
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
                              User.sync().then(function(){
                                  console.log("User")
                                  User.associate(Statut);
                                  //Creation données de test. Possibilité de les mettre ailleurs ?
                                  User.create({
                                    password: 'test',
                                    nom: 'Administrateur',
                                    prenom: 'Test',
                                    email: "admin@admin.com",
                                    statutId:1,
                                    groupeId:1,
                                    entrepriseId:1
                                  }).then(function(){
                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller',
                                      prenom: 'Test',
                                      email: "conseiller@conseiller.com",
                                      statutId: 2,
                                      groupeId:1,
                                      entrepriseId:1
                                    });
                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller1',
                                      prenom: 'Test',
                                      email: "c1@conseiller.com",
                                      statutId: 2,
                                      groupeId:1,
                                      entrepriseId:1
                                    });
                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller2',
                                      prenom: 'Test',
                                      email: "c2@conseiller.com",
                                      statutId: 2,
                                      groupeId:1,
                                      entrepriseId:1
                                    });
                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller3',
                                      prenom: 'Test',
                                      email: "c3@conseiller.com",
                                      statutId: 2,
                                      groupeId:1,
                                      entrepriseId:1
                                    });
                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller4',
                                      prenom: 'Test',
                                      email: "c4@conseiller.com",
                                      statutId: 2,
                                      entrepriseId:1
                                    });

                                    User.create({
                                      password: 'test',
                                      nom: 'Conseiller5',
                                      prenom: 'Test',
                                      email: "c5@conseiller.com",
                                      statutId: 2,
                                      entrepriseId:1
                                    });

                                    Groupe.create({
                                      intitule: "Annulation de commandes",
                                      entrepriseId:1
                                    }).then(function(){
                                      User.sync().then(function(){

                                        User.create({
                                          password: 'test',
                                          nom: 'Conseiller6',
                                          prenom: 'Test',
                                          email: "c6@conseiller.com",
                                          statutId:2,
                                          groupeId:2,
                                          entrepriseId:1
                                        });
                                        User.create({
                                          password: 'test',
                                          nom: 'Conseiller7',
                                          prenom: 'Test',
                                          email: "c7@conseiller.com",
                                          statutId:2,
                                          entrepriseId:1
                                        });
                                      });
                                    });
                                  });
                              });
                            });
                          });
                        })
                      });
                  });
                });
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
app.get('/logout', controller.logout);
app.post('/auth', controller.auth);
app.post('/register', controller.register);
app.get('/admin', controller.admin);
app.get('/admin/gestionnaire', controller.admin);
app.get('/admin/historique', controller.admin);
app.get('/conseiller', controller.conseiller);
app.get('/conseiller/historique', controller.conseiller);
app.get('/conseiller/chat/:id', controller.conseiller);
app.post('/admin/showgroups',controller.showgroups);
app.post('/admin/showConseillersgroups',controller.showUsersOfgroups);
app.post('/admin/addgroup',controller.addgroup);

app.get("/user/get", controller.getUser);
app.post("/user/update", controller.updateUser);

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
