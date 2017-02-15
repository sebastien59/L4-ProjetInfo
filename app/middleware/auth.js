/**
  Middleware d'authentification
**/

let session = require("express-session");

module.exports=  function (req, res, next) {
  // Est ce que la session existe ?
  if(req.session.login != undefined){
      next(); // Oui, on passe à la suite de la requête
  }else{
      res.redirect("/login"); //Sinon on redirige vers la page de login
  }
}
