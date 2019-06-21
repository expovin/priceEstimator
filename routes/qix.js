var express = require('express');
var ClassQIX = require('../Classes/QIX');
var router = express.Router();

var QSEngine = new ClassQIX();
/*
QSEngine.init()
.then( () =>{
    console.log("QIX Initialization done!")
})
.catch( error => console.log("Error while initializing QIX "+error))
*/
/* GET users listing. */
router.get('/SessionDetails', function(req, res, next) {
  res.status(200).json(QSEngine.getSessionMatrix())
});

router.post('/Connect', function(req, res, next) {
    QSEngine.init(req.body)
    .then( () =>{
        console.log("Engine Aperto, mi appresto a ricercare l'app")
        return QSEngine.getDocList()
    })
    .then( doc =>{
        res.status(200).json(doc)
    })
});

router.post('/App', function(req, res, next) {
    console.log("req.headers >>> "+req.headers.appid)
    QSEngine.openApp(req.headers.appid)
    .then( doc =>{
        res.status(200).json({success:true, message:"App Opened"})
    })
});

  
module.exports = router;
