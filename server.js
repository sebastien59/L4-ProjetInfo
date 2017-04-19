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
      Groupe.drop();
      Entreprise.drop();
      Chat.drop();
      Appel.drop();
      Message.drop();
      Fichier.drop();

      Fichier.sync({force:true}).then(function(){
        Message.sync({force:true}).then(function(){
          Appel.sync({force:true}).then(function(){
            Appel.bulkCreate([
                {
                  "idConseiller": 5,
                  "note": 7,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2015/07/29 07:07:55",
                  "dateFin": "2017/01/22 11:51:27",
                  "fini": true
                },
                {
                  "idConseiller": 5,
                  "note": 4,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2016/04/21 01:36:06",
                  "dateFin": "2017/02/10 05:02:08",
                  "fini": false
                },
                {
                  "idConseiller": 5,
                  "note": 9,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2016/02/22 07:02:23",
                  "dateFin": "2017/01/11 02:02:25",
                  "fini": false
                },
                {
                  "idConseiller": 5,
                  "note": 6,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2015/07/31 07:02:39",
                  "dateFin": "2017/04/15 04:41:56",
                  "fini": true
                },
                {
                  "idConseiller": 7,
                  "note": 8,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2015/02/22 01:37:50",
                  "dateFin": "2016/11/08 07:37:07",
                  "fini": true
                },
                {
                  "idConseiller": 7,
                  "note": 6,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2015/09/24 03:07:06",
                  "dateFin": "2017/05/22 07:12:26",
                  "fini": true
                },
                {
                  "idConseiller": 3,
                  "note": 8,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2016/01/17 06:43:38",
                  "dateFin": "2016/11/27 09:06:28",
                  "fini": false
                },
                {
                  "idConseiller": 4,
                  "note": 5,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2015/10/04 05:01:00",
                  "dateFin": "2017/01/17 11:27:01",
                  "fini": true
                },
                {
                  "idConseiller": 6,
                  "note": 9,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2016/12/29 11:45:23",
                  "dateFin": "2017/05/04 06:24:43",
                  "fini": false
                },
                {
                  "idConseiller": 5,
                  "note": 6,
                  "idEntreprise": 1,
                  "emailClient": "herrerarobles@parcoe.com",
                  "dateDebut": "2017/05/19 06:20:49",
                  "dateFin": "2017/03/25 03:40:26",
                  "fini": true
                }
              ]);


              Entreprise.sync({force:true}).then(function(){
                Entreprise.create({
                  libelle: "Centrale Lille",
                  key: "AD7S9FDS09D9OJZ0AL",
                  url: "localhost"
                }).then(function(){
                  Groupe.sync({force:true}).then(function(){
                    Groupe.bulkCreate([{
                      intitule: "Retour des commandes",
                      entrepriseId:1
                    }, {
                      intitule: "Annulation de commandes",
                      entrepriseId:1
                    }]).then(function(){
                        Statut.sync().then(function(){
                          console.log("Statut")
                          Statut.bulkCreate([{
                                  libelle: "Administrateur"
                                },{
                                  libelle: "Conseiller"
                                },{
                                  libelle: "Client"
                              }]).then(function(){
                                Statut.associate(User); // On lie les statuts au utilisateur
                                //User.associateChat(Chat);Chat.sync()
                                Chat.sync().then(function(){
                                  Chat.bulkCreate([
                                    {
                                      "idConseiller": 5,
                                      "note": 4,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 7,
                                      "note": 7,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/08/11 10:30:44",
                                      "dateFin": "2017/08/11 10:50:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 2,
                                      "note": 0,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/09/06 08:00:44",
                                      "dateFin": "2017/09/06 08:29:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 5,
                                      "note": 3,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 7,
                                      "note": 1,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 6,
                                      "note": 0,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": false
                                    },
                                    {
                                      "idConseiller": 8,
                                      "note": 0,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": false
                                    },
                                    {
                                      "idConseiller": 8,
                                      "note": 2,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 3,
                                      "note": 6,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    },
                                    {
                                      "idConseiller": 4,
                                      "note": 8,
                                      "idEntreprise": 1,
                                      "emailClient": "herrerarobles@parcoe.com",
                                      "dateDebut": "2017/05/12 04:29:44",
                                      "dateFin": "2017/05/12 05:00:39",
                                      "fini": true
                                    }
                                  ])
                                User.sync().then(function(){
                                    console.log("User")
                                    User.associate(Statut);
                                    //Creation données de test. Possibilité de les mettre ailleurs ?
                                    User.bulkCreate([{
                                      password: 'test',
                                      nom: 'Administrateur',
                                      prenom: 'Test',
                                      email: "admin@admin.com",
                                      statutId:1,
                                      groupeId:1,
                                      entrepriseId:1
                                    },{
                                        password: 'test',
                                        nom: 'Conseiller',
                                        prenom: 'Test',
                                        email: "conseiller@conseiller.com",
                                        statutId: 2,
                                        groupeId:1,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller1',
                                        prenom: 'Test',
                                        email: "c1@conseiller.com",
                                        statutId: 2,
                                        groupeId:1,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller2',
                                        prenom: 'Test',
                                        email: "c2@conseiller.com",
                                        statutId: 2,
                                        groupeId:1,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller3',
                                        prenom: 'Test',
                                        email: "c3@conseiller.com",
                                        statutId: 2,
                                        groupeId:1,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller4',
                                        prenom: 'Test',
                                        email: "c4@conseiller.com",
                                        statutId: 2,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller5',
                                        prenom: 'Test',
                                        email: "c5@conseiller.com",
                                        statutId: 2,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller6',
                                        prenom: 'Test',
                                        email: "c6@conseiller.com",
                                        statutId:2,
                                        groupeId:2,
                                        entrepriseId:1
                                      },{
                                        password: 'test',
                                        nom: 'Conseiller7',
                                        prenom: 'Test',
                                        email: "c7@conseiller.com",
                                        statutId:2,
                                        entrepriseId:1
                                      }])
                                });
                            });
                          });
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
app.get('/conseiller/getUserHistorique', controller.getUserHistorique);
app.get('/conseiller/chat/:id', controller.conseiller);
app.post('/admin/showgroups',controller.showgroups);
app.post('/admin/showConseillersgroups',controller.showUsersOfgroups);
app.get('/admin/showConseillersRestants',controller.showUsersRestants);
app.post('/admin/addgroup',controller.addgroup);
app.get('/admin/getHistorique', controller.historique);
app.get('/getConseillers', controller.getConseillers);
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
