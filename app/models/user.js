/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var User = sequelize.define('user', {
  nom: Sequelize.STRING(20),
  prenom: Sequelize.STRING(40),
  email: {type: Sequelize.STRING(40), unique:true},
  password: Sequelize.STRING(50),
  statutId: {
    type: Sequelize.INTEGER,
    references: {
      model: "statuts",
      key: "statutid"
    }
  }
}, {
    classMethods: {
      associate: function(Statut) {
        User.belongsTo(Statut);
      }
    }
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//sequelize.sync({force:true});

module.exports = User
