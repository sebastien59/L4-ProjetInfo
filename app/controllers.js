/*
  Fichier de controller
  Créer un dossier controller et les importer dans celui ci afin de rendre le tout plus claire si nous avons de grand (ou beaucoup de) controller ?

*/
let database = require('../config/database.js');
let Sequelize = require('sequelize');
let Group = require('./models/groupe.js');
let Entreprise = require('./models/entreprise.js');
let Chat = require('./models/chat.js');
let Appel = require('./models/appel.js');
let Message = require('./models/message.js');
let Fichier = require('./models/fichier.js');
let User = require('./models/user.js');
let Statut = require('./models/statut.js');

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
          if(user.get("groupeId")!=null){
            Group.findOne({
              where:{ id: user.get("groupeId")}
            }).then(function(groupe){
              req.session.groupe={id: user.get('groupeId'), nom: groupe.get('intitule') };
              if(req.session.statut == "Administrateur"){
                res.redirect("/admin");
              }else if (req.session.statut == "Conseiller") {
                res.redirect("/conseiller");
              }else if(req.session.statut == "Client"){
                res.redirect("/client");
              }
            })
          }else{
            req.session.groupe =null;
            if(req.session.statut == "Administrateur"){
              res.redirect("/admin");
            }else if (req.session.statut == "Conseiller") {
              res.redirect("/conseiller");
            }else if(req.session.statut == "Client"){
              res.redirect("/client");
            }
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
    attributes: ['nom','prenom','id'],
      where: {
      statutId:2,
      groupeId:groupe_selected
    }
  }).then(function(users){
      res.send(JSON.stringify(users));
    });
}

let showUsersRestantsController = (req, res) => {

  User.findAll({
    attributes: ['nom','prenom','id'],
      where: {
      statutId:2,
      groupeId:null
    }
  }).then(function(users){
      res.send(JSON.stringify(users));
    });
  }

let addGroupController = (req, res) => {
  if(req.body.nomGroupe != ""){
    Group.create({
      intitule: req.body.nomGroupe,
      entrepriseId: req.session.entreprise
    }).then(function(groupe){
        res.json({id : groupe.get('id'), intitule: groupe.get("intitule")});
    })
  }else{
    res.json({result : 0});
  }
};

let AddUserInGroupController = (req, res) => {
idconseiller = req.body.conseillerId;
idgroupe = req.body.groupeId;
    User.update(
      { groupeId : idgroupe } ,
      {
        where: { id: idconseiller }
      }
    ).then(function(user){
      res.json({result: 1});
    });
}

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


let getHistorique = (req, res) => {
  database.sequelize
      .query('SELECT * FROM chats c JOIN users u ON u.id=c.idConseiller', { model: Chat })
      .then(function(chats){
        chats = chats.map(function(obj){
          return obj.get("getJson");
        });

        database.sequelize
            .query('SELECT * FROM appels a JOIN users u ON u.id=a.idConseiller', { model: Appel })
            .then(function(appels){
                appels = appels.map(function(obj){
                  return obj.get("getJson");
                });
              res.json(chats.concat(appels));
            });
      });
}

let getUserHistorique = (req, res) => {
  database.sequelize
      .query('SELECT * FROM chats c JOIN users u ON u.id=c.idConseiller WHERE u.id = :userId' , {
        replacements: { userId: req.session.idUser},
        model: Chat })
      .then(function(chats){
        chats = chats.map(function(obj){
          return obj.get("getJson");
        });

        database.sequelize
            .query('SELECT * FROM appels a JOIN users u ON u.id=a.idConseiller WHERE u.id = :userId', {
              replacements: { userId: req.session.idUser},
              model: Appel })
            .then(function(appels){
                appels = appels.map(function(obj){
                  return obj.get("getJson");
                });
              res.json(chats.concat(appels));
            });
      });
}

let getConseillers = (req, res) => {
  User.findAll({
    where: {
      statutId:2,
      entrepriseId:req.session.entreprise
    }
  }).then(function(users){
    res.json(users);
  });
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
            entreprise: req.session.entreprise,
            groupe:req.session.groupe});
}

let updateUserController = (req, res) =>{
  let bool = 0;
  if(req.body.password == ""){
    delete req.body.password;
  }else if (req.body.password != req.body.passwordConfirm) {
    res.json({result : 0});
    bool = 1;
  }


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
  showUsersRestants : showUsersRestantsController,
  addgroup: addGroupController,
  AddUserInGroup: AddUserInGroupController,
  getUser: getUserController,
  updateUser: updateUserController,
  historique: getHistorique,
  getConseillers: getConseillers,
  getUserHistorique:getUserHistorique
}
