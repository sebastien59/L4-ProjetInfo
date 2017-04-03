/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Chat = sequelize.define('chat', {
    idConseiller: Sequelize.INTEGER,
    note:Sequelize.INTEGER,
    idEntreprise:Sequelize.INTEGER,
    emailClient:Sequelize.STRING(40),
    date: Sequelize.DATE,
    note: Sequelize.BOOLEAN
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
Chat.sync({force:true});

module.exports = Chat
