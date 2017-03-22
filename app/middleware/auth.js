/**
  Middleware d'authentification
**/

let session = require("express-session");

module.exports=  function (req, res, next) {
  // Est ce que la session existe ?
  if(req.session.email != undefined){
      switch(req.baseUrl){
        case '/conseiller':
            if(req.session.statut != 'Conseiller'){
              res.redirect('/error');
              return res.end();
            }
          break;
        case '/admin':
            if(req.session.statut != 'Administrateur'){
              res.redirect('/error');
              return res.end();
            }
          break;
      }
      next(); // Oui, on passe à la suite de la requête
  }else{
      res.redirect("/login"); //Sinon on redirige vers la page de login
  }
}
