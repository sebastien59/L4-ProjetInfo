/*
  Model User
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;
let moment = require('moment');

// Initialisation du model
var Chat = sequelize.define('chat', {
    idConseiller: Sequelize.INTEGER,
    note:Sequelize.INTEGER,
    idEntreprise:Sequelize.INTEGER,
    emailClient:Sequelize.STRING(40),
    dateDebut: Sequelize.DATE,
    dateFin: Sequelize.DATE,
    fini: Sequelize.BOOLEAN
  },{
      getterMethods : {
        getJson : function(){
          var startDate = moment(this.dateDebut, 'YYYY-M-DD HH:mm:ss');
          var endDate = moment(this.dateFin, 'YYYY-M-DD HH:mm:ss');
          var diff = endDate.diff(startDate, 'minutes');

          var dateD =new Date(this.dateDebut)
          return {
            id: "t"+this.id,
            Conseiller: {
              id: this.idConseiller,
              nom: this.get('nom'),
              prenom: this.get('prenom'),
              email: this.get('email')
            },
            note:this.note,
            idEntreprise:this.idEntreprise,
            emailClient:this.emailClient,
            date: new Date(moment(this.dateDebut, 'YYYY-MM-DD HH:mm:ss').format("YYYY/MM/DD")),
            duree: diff,
            fini: this.fini,
            type: "texte",
          }
        }
      }
    }
  );

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//Chat.sync();

module.exports = Chat
