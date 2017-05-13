/*
  Model Message
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Message = sequelize.define('message', {
    text: Sequelize.TEXT,
    date:Sequelize.DATE,
    idChat:Sequelize.INTEGER,
    idFichier:Sequelize.INTEGER,
    isConseiller: Sequelize.BOOLEAN
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//Message.sync();

module.exports = Message
