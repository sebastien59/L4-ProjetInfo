/*
  Model Fichier
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Fichier = sequelize.define('fichier', {
    chemin: Sequelize.STRING(255),
    date:Sequelize.DATE
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//Fichier.sync();

module.exports = Fichier
