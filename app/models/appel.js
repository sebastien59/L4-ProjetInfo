/*
  Model Appel
*/

// Initialisation des modules
let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;
let moment = require('moment');

// Initialisation du model
var Appel = sequelize.define('appel', {
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
        var startDate = moment(this.dateDebut, 'YYYY-MM-DD HH:mm:ss');
        var endDate = moment(this.dateFin, 'YYYY-MM-DD HH:mm:ss');
        var diff = endDate.diff(startDate, 'minutes');

        var dateD =new Date(this.dateDebut)
        return {
          id: "a"+this.id,
          Conseiller: {
            id: this.idConseiller,
            nom: this.get('nom'),
            prenom: this.get('prenom'),
            email: this.get('email')
          },
          note:this.note,
          idEntreprise:this.idEntreprise,
          emailClient:this.emailClient,
          date: moment(this.dateDebut, 'YYYY-M-DD HH:mm:ss').format("DD/MM/YYYY"),
          duree: diff,
          fini: this.fini,
          type: "audio",
        }
      }
    }
  });

/*
  On force la suppression afin de créer la table à chaque lancement de l'application. Utile en dev uniquement.
*/
//Appel.sync();

module.exports = Appel
