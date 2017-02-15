/*
  Model userstatut
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var userstatut = sequelize.define('userstatut');

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
sequelize.sync({force:true});

module.exports = userstatut;
