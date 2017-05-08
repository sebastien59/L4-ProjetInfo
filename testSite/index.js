/**
  Import des modules nécessaires
**/
let express = require("express");
var cors = require('cors');

// initialisation de expressJs
let app=express();

app.get('/', function(req, res){
  res.sendfile('index.html')
});

app.listen(8081);
