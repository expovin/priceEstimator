const enigma = require('enigma.js');
var serializeapp = require('serializeapp')
const enigmaConfig = require('../conf/enigma');
const Config = require('../conf/settings');
const settings = new Config();

class QIX {

    constructor(MonApp=settings.QIX.OPMON){
        this.MonApp=MonApp;
        this.qdoc;
        this.fieldObj;
        this.objId;
        this.serializedApp;
        this.qix;
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
                return this.qix.openDoc({qDocName:this.MonApp})
            }, err => { reject("Error opening Document :"+err); })
            .then(qdoc => {
                this.qdoc=qdoc;
                return this.serialize();
            }, err => { reject("Error serializing Document :"+err); })
            .then(data =>{
                this.serializedApp=data;
                fulfill("Initialization done");
            })
            .catch(error => reject(error))
        })
    }

    getDimensions() { return this.serializedApp.dimensions }
    getMeasures() {return this.serializedApp.measures }
    getSheets() { return this.serializedApp.sheets }
    getStories() { return this.serializedApp.stories }
    getMasterObjects() { return this.serializedApp.masterobjects }
    getDataConnections() { return this.serializedApp.dataconnections }
    getBookmarks() {return this.serializedApp.bookmarks }
    getEmbeddedmedias() {return this.serializedApp.embeddedmedia }
    getFields() {return this.serializedApp.embeddedmedia }
    getSnapshoots() { return this.serializedApp.snapshots }
    getProperties(){ return this.serializedApp.properties }
    getLoadscript() { return this.serializedApp.loadscript }

    getDimensionByName(name) { return this.serializedApp.dimensions.filter( element => { return element.qDim.title === name })}
    getMeasureByName(name) { return this.serializedApp.measures.filter( element => { return element.qMeasure.qLabel === name })}
    getSheetByName(name) { return this.serializedApp.sheets.filter( element => { return element.qProperty.qMetaDef.title === name })}
    getMasterObjectByName(name) { return this.serializedApp.masterobjects.filter( element => { return element.qProperty.qMetaDef.title === name })}
    getDataConnectionByName(name) { return this.serializedApp.dataconnections.filter( element => { return element.qName === name })}




    serialize(){
        return new Promise( (fulfill, reject) =>{
            serializeapp(this.qdoc)
            .then( info => fulfill(info))
            .catch ( error => reject(error))
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