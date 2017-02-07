let Sequelize = require('sequelize');
let database = require('../../config/database.js');
let sequelize = database.sequelize;

var User = sequelize.define('user', {
  login: Sequelize.STRING(20),
  password: Sequelize.STRING(50),
  nom: Sequelize.STRING(20),
  prenom: Sequelize.STRING(40),
  idStatus: Sequelize.INTEGER(1)
});

sequelize.sync({force:true}).then(function(){
  //creation données de test
  User.create({
    login: 'admin',
    password: 'test',
    nom: 'Administrateur',
    prenom: 'Test',
    idStatus: 1
  });
});

module.exports = User;
