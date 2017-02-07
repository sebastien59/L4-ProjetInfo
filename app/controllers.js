let User = require('./models/user.js')

let indexController = (req, res) =>{
  res.sendfile('./public/index.html');
};

let loginController = (req, res) =>{
  res.sendfile('./public/login.html');
};

let authController = (req, res) =>{
  User.findOne({
    where: {login:req.body.login, password:req.body.password}
  }).then(function(user){
    if(user != null){
      req.session.login = req.body.login;
      req.session.nom = user.get("nom");
      req.session.prenom = user.get("prenom");
      req.session.status = user.get("idStatus");
      res.redirect("/gestion");
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

  if(req.session.login != undefined)
    res.send('aaaa')
  else {
    res.send("qsdq")
  }
};

module.exports = {
  index : indexController,
  login : loginController,
  auth : authController,
  register : registerController,
  admin : adminController
}
