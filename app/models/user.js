/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;
let Statut = require('./statut.js');
let userstatut = require('./userstatut.js');

// Initialisation du model
var User = sequelize.define('user', {
  login: Sequelize.STRING(20),
  password: Sequelize.STRING(50),
  nom: Sequelize.STRING(20),
  prenom: Sequelize.STRING(40),
  email: Sequelize.STRING(40),
});

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
sequelize.sync({force:true}).then(function(){
  //Creation données de test. Possibilité de les mettre ailleurs ?
  User.create({
    login: 'admin',
    password: 'test',
    nom: 'Administrateur',
    prenom: 'Test',
    email: "merchez.sebastien@gmail.com"
  });
  User.create({
    login: 'conseiller',
    password: 'test',
    nom: 'Conseiller',
    prenom: 'Test',
    email: "merchez.sebastien@gmail.com",
  }).then(function(user){
    userstatut.create({
      userId: user.get('id'),
      statutId: 2,
    })
  });
});

module.exports = User;
