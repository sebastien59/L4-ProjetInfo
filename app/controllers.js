/*
  Fichier de controller
  Créer un dossier controller et les importer dans celui ci afin de rendre le tout plus claire si nous avons de grand (ou beaucoup de) controller ?

*/
let Sequelize = require('sequelize');
let Statut = require('./models/statut.js');
let User = require('./models/user.js');

let indexController = (req, res) =>{
  //res.sendfile('./public/index.html');
  res.redirect('/login');
};

let loginController = (req, res) =>{
  console.log(new Date()+" : Accès route login");
  res.sendfile('./public/login.html');
};

let authController = (req, res) =>{
  console.log(new Date()+" : Accès route auth");
  console.log(req.body.login, req.body.password)
  User.findOne({
    where: {email:req.body.login, password:req.body.password},
    include: [{
        model: Statut,
        where: { id: Sequelize.col('user.statutId') }
    }]
  }).then(function(user){

    if(user != null){
      user.getStatut().then(function(statut){

          req.session.email = user.get("email");
          req.session.nom = user.get("nom");
          req.session.prenom = user.get("prenom");
          req.session.statut = statut.get('libelle');

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

  if(req.body.password == req.body.passwordConfirm && req.body.nom !== undefined && req.body.prenom !== undefined  && req.body.email !== undefined){
    User.create({
      nom:req.body.nom,
      prenom:req.body.prenom,
      email:req.body.email,
      password:req.body.password,
      statutId:2
    }).then(function(){
      res.send(JSON.stringify({result: 'insertion correcte'}));
    }).catch(function (err) {
        res.send(JSON.stringify({error: "Erreur lors de l\'inscription"}));
    });
  }else{
    res.send(JSON.stringify({error: "Erreur lors de l\'inscription"}));
  }
}

let adminController = (req, res) =>{
  res.sendfile('./public/administration/administrateur.html');
};

let conseillerController = (req, res) =>{
  console.log(new Date()+" : Accès route conseiller");
  res.sendfile('./public/conseiller/index.html');
};

let errorController = (req, res) => {
  res.status(500).sendfile('./public/error.html');
}

let logoutController = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
}

// Export de chaque controller permettant de les appeller en faisant controller.index
module.exports = {
  index : indexController,
  login : loginController,
  logout : logoutController,
  auth : authController,
  register : registerController,
  admin : adminController,
  conseiller : conseillerController,
  error: errorController
}
