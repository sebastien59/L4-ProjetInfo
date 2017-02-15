/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;
let User = require('./user.js');

// Initialisation du model
var Statut = sequelize.define('statut', {
  libelle: Sequelize.STRING(15)
});

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
sequelize.sync({force:true}).then(function(){
  //Creation données de test. Possibilité de les mettre ailleurs ?
  Statut.create({
    libelle: "admin"
  });
  Statut.create({
    libelle: "conseiller"
  });
  Statut.create({
    libelle: "client"
  });
});

module.exports = Statut;
