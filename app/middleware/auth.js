let session = require("express-session");

module.exports=  function (req, res, next) {
  if(req.session.login != undefined){
      next();
  }else{
      res.redirect("/login");
  }
}
