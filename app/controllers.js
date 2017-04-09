/*
  Fichier de controller
  Créer un dossier controller et les importer dans celui ci afin de rendre le tout plus claire si nous avons de grand (ou beaucoup de) controller ?

*/
let Sequelize = require('sequelize');
let Statut = require('./models/statut.js');
let User = require('./models/user.js');
let Group = require('./models/groupe.js');

let indexController = (req, res) =>{
  //res.sendfile('./public/index.html');
  res.redirect("/login");
};

let loginController = (req, res) =>{
  console.log(new Date()+" : Accès route login");
  res.sendfile('./public/login.html');
};

let authController = (req, res) =>{
  console.log(new Date()+" : Accès route auth");

  User.findOne({
    where: {email:req.body.login, password:req.body.password},
    include: [{
        model: Statut,
        where: { id: Sequelize.col('user.statutId') }
    }]
  }).then(function(user){

    if(user != null){
      user.getStatut().then(function(statut){
          req.session.idUser = user.get("id");
          req.session.email = user.get("email");
          req.session.nom = user.get("nom");
          req.session.prenom = user.get("prenom");
          req.session.statut = statut.get('libelle');
          req.session.entreprise= user.get('entrepriseId');

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

let ShowGroupsController = (req, res) => {
  Group.findAll({
    attributes: ['id','intitule'],
    where:{
      entrepriseId: req.session.entreprise
    }
  }).then(function(groups){
   res.send(JSON.stringify(groups));
  });
}

let ShowConseillerOfGroupController = (req, res) => {
  var groupe_selected = req.body.groupeId;
  User.findAll({
    attributes: ['nom','prenom'],
      where: {
      statutId:2,
      groupeId:groupe_selected
    }
  }).then(function(users){
      res.send(JSON.stringify(users));
    });
}

let addGroupController = (req, res) => {
  console.log(req.body);
  if(req.body.nomGroupe != ""){
    Group.create({
      intitule: req.body.nomGroupe,
      entrepriseId: req.session.entreprise
    }).then(function(groupe){
        console.log(groupe)

        res.json({id : groupe.get('id'), intitule: groupe.get("intitule")});
    })
  }else{
    res.json({result : 0});
  }
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

/**
  USER
**/

let getUserController = (req, res) =>{
  res.json({id: req.session.idUser,
            email: req.session.email,
            nom: req.session.nom,
            prenom: req.session.prenom,
            statut: req.session.statut,
            entreprise: req.session.entreprise});
}

let updateUserController = (req, res) =>{
  console.log("body :::: ", req.body)
  let bool = 0;
  if(req.body.password == ""){
    delete req.body.password;
  }else if (req.body.password != req.body.passwordConfirm) {
    res.json({result : 0});
    bool = 1;
  }

  console.log("Session :::: ", req.session)

  console.log("body :::: ", req.body)

  if(bool == 0){
    delete req.body.passwordConfirm;
    delete req.body.entreprise;
    delete req.body.prenom;
    delete req.body.nom;



    User.update(
      req.body,
      {
        where: { id: req.session.idUser }
      }
    ).then(function(user){
      console.log(user)
      res.json({result: 1});
    });
  }
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
  error: errorController,
  showgroups:ShowGroupsController,
  showUsersOfgroups:ShowConseillerOfGroupController,
  addgroup: addGroupController,
  getUser: getUserController,
  updateUser: updateUserController
}
