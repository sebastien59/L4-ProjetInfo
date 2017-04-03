/*
  Model Entreprise
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Entreprise = sequelize.define('entreprise', {
    libelle: Sequelize.STRING(40),
    key: Sequelize.STRING(40),
    url: Sequelize.STRING(200)
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//Entreprise.sync({force:true});

module.exports = Entreprise
