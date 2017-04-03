/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Groupe = sequelize.define('groupe', {
    intitule: Sequelize.STRING(40),
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
Groupe.sync({force:true});

module.exports = Groupe
