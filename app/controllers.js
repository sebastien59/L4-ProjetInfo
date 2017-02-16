/*
  Fichier de controller
  Créer un dossier controller et les importer dans celui ci afin de rendre le tout plus claire si nous avons de grand (ou beaucoup de) controller ?

*/
let Sequelize = require('sequelize');
let User = require('./models/user.js');
let Statut = require('./models/statut.js');

let indexController = (req, res) =>{
  res.sendfile('./public/index.html');
};

let loginController = (req, res) =>{
  res.sendfile('./public/login.html');
};

let authController = (req, res) =>{
  User.findOne({
    where: {login:req.body.login, password:req.body.password},
    include: [{
        model: Statut,
        where: { userId: Sequelize.col('user.id') }
    }]
  }).then(function(user){
    if(user != null){
      user.getStatuts().then(function(statut){
          console.log(statut[0].libelle)

          req.session.login = req.body.login;
          req.session.nom = user.get("nom");
          req.session.prenom = user.get("prenom");
          req.session.statut = statut[0].libelle;

          if(req.session.statut == "Administrateur"){
            res.redirect("/admin");
          }else if (req.session.statut == "Conseiller") {
            res.redirect("/conseiller");
          }else if(req.session.statut == "Client"){
            res.redirect("/client");
          }
      });
    }else{
        res.redirect("/login")
      }
  });
};

let registerController = (req, res) =>{
  var login = req.param('login');
  var password = req.param('password');
  console.log(login + ' --- '+password);
}

let adminController = (req, res) =>{
  res.send("Admin");
};

let conseillerController = (req, res) =>{
  res.sendfile('./public/conseiller.html');
};

// Export de chaque controller permettant de les appeller en faisant controller.index
module.exports = {
  index : indexController,
  login : loginController,
  auth : authController,
  register : registerController,
  admin : adminController,
  conseiller : conseillerController
}
