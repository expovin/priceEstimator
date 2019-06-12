const enigma = require('enigma.js');
const enigmaConfig = require('../conf/enigma');
const Config = require('../conf/settings');
const settings = new Config();

class QIX {

    constructor(MonApp=settings.QIX.OPMON){
        this.MonApp=MonApp;
        this.appObj;
        this.fieldObj;
        this.objId;
        this.DimensionId=[];
        console.log("Instanziato Classe QIX "+this.MonApp);
    }
    init(){
        console.log("Called OpenEngine");
        return new Promise ( (fulfill, reject) => {
            enigma.create(enigmaConfig)
            .open()
            .then((qix) => {
                console.log("QIX Engine correctly opened");
                this.qix=qix;                
                fulfill(qix);
            }, error => reject(error) );
        })
    }

    closeEngine(){
        return new Promise( (fulfill, reject) => {
            enigma.create(enigmaConfig).close()
            .then( res =>{
                fulfill (res);
            }, error => {
                reject(error);
            })
        })
    }
    
    getEngineVersion() {
        return new Promise( (fulfill, reject) =>{
            this.qix.engineVersion()
            .then( ver => fulfill(ver))
            .catch( error => {reject(error)})
        })

    }

    getDocList() {  
        return new Promise ( (fulfill, reject) =>{
            this.qix.getDocList()
            .then(apps => {
                fulfill(apps);
            })
            .catch( error => {reject(error)})
        })
    }

    openDoc(){
        console.log("App da aprire "+this.MonApp);
        return new Promise( (fulfill, reject) =>{
            this.qix.openDoc({qDocName:this.MonApp})
            .then(qdoc => {
                this.appObj=qdoc;
                fulfill({data:"Doc Opened",appObj:this.appObj});
            }, err => {
                reject(err);
            })
            .catch(error => {
                reject(error);
            })
        })
    }

    getAllInfos() {  
        return new Promise ( (fulfill, reject) =>{
            this.appObj.getAllInfos()
            .then(info => {
                fulfill(info);
            })
            .catch( error => {reject(error)})
        })
    }

    getField(fieldName) {  
        return new Promise ( (fulfill, reject) =>{
            this.appObj.getField({qFieldName:fieldName})
            .then(fieldObj => {
                this.fieldObj=fieldObj;
                fulfill(fieldObj);
            })
            .catch( error => {reject(error)})
        })
    }
    
    getObject(qId) {  
        return new Promise ( (fulfill, reject) =>{
            this.appObj.getObject({qId:qId})
            .then(objId => {
                this.objId=objId;
                fulfill(objId);
            })
            .catch( error => {reject(error)})
        })
    }

    getLayout(qId) {  
        return new Promise ( (fulfill, reject) =>{
            this.appObj.getLayout({qId:qId})
            .then(objId => {
                this.objId=objId;
                fulfill(objId);
            })
            .catch( error => {reject(error)})
        })
    }

    getDimension(qId) {  
        return new Promise ( (fulfill, reject) =>{
            this.appObj.getDimension({qId:qId})
            .then(objId => {
                this.DimensionId.push(objId);
                fulfill(objId);
            })
            .catch( error => {reject(error)})
        })
    }
    
    getHypercubeData() {  
        return new Promise ( (fulfill, reject) =>{
            this.objId.getHyperCubeData({qPath: "/qHyperCubeDef",		"qPages": [
                {
                    "qLeft": 0,
                    "qTop": 0,
                    "qWidth": 11,
                    "qHeight": 100
                }]})
            .then(hypercube => {
                fulfill(hypercube);
            })
            .catch( error => {reject(error)})
        })
    }

}

module.exports = QIX;