/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

// Initialisation du model
var Statut = sequelize.define('statut', {
  libelle: Sequelize.STRING(15)
}, {
    classMethods: {
      associate: function(User) {
        Statut.hasOne(User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
Statut.sync({force:true});

module.exports = Statut
