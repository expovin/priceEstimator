const enigma = require('enigma.js');
var serializeapp = require('serializeapp')
//const enigmaConfig = require('../conf/enigma');
const Config = require('../conf/settings');
const settings = new Config();
const { base64encode, base64decode } = require('nodejs-base64');
const WebSocket = require('ws');
const schema = require('enigma.js/schemas/12.20.0.json');
const fs = require('fs');
const path = require('path');


class QIX {

    constructor(MonApp=settings.QIX.OPMON){
        this.MonApp=MonApp;
        this.qdoc;
        this.fieldObj;
        this.objId;
        this.serializedApp;
        this.qix;
        this.SessionDetailsObj;
        this.SessionDetailsId;
        this.SessionDetailsData;
        this.Promises=[];
        this.SessionDetailsmatrix=[];
        console.log("Instanziato Classe QIX "+this.MonApp);

    }

    openApp(appId){

        console.log("appId pre : "+appId);
        if (typeof appId === 'undefined' || appId === null)
            appId=this.MonApp

        console.log("appId post : "+appId);
        return new Promise ((fulfill, reject) =>{
            console.log("Opening AppId "+appId);
            this.qix.openDoc({qDocName:appId})
            .then(qdoc => {
                this.qdoc=qdoc;
                return this.serialize();
            }, err => { reject("Error serializing Document :"+err); })
            .then(data =>{
                this.serializedApp=data;
                return this.getSheetByName('Session Details')[0].qChildren.filter( element =>{ return element.qProperty.title === "Session Details"})
            })             
            .then((sd) =>{
                this.SessionDetailsId = sd[0].qProperty.qInfo.qId;
                return this.qdoc.getObject(this.SessionDetailsId)
            })   
            .then((SessionDetailsObj) =>{
                this.SessionDetailsObj=SessionDetailsObj;
                return this.SessionDetailsObj.getLayout()
            })                    
            .then((layout)=>{
                
                this.qcy=layout.qHyperCube.qSize.qcy;
                var page=Math.ceil(this.qcy/900);
                return this.getHypercubeData(page)
            })
            .then( data =>{
                this.SessionDetailsmatrix = [].concat.apply([], this.SessionDetailsmatrix);
                return this.getSheetByName('Performance')[0].qChildren.filter( element =>{ return element.qProperty.title === "Performance Summary"})
                
            })    

            .then((sd) =>{
                return this.qdoc.getObject(sd[0].qProperty.qInfo.qId)
            })   
            .then((SessionDetailsObj) =>{
                return SessionDetailsObj.getLayout()
            })                    
            .then((layout)=>{
                console.log(layout);
                this.qcy=layout.qHyperCube.qSize.qcy;
                var page=Math.ceil(this.qcy/900);
                fulfill("Initialization done");
                //return this.getHypercubeData(page)
            })

            .catch(error => reject(error))
        })
    }


    init(params){

        //const readCert = filename => fs.readFileSync(path.resolve(__dirname, certificatesPath, filename));

        return new Promise ( (fulfill, reject) => {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
            const enigmaConfig = {
                schema,
              //  mixins,
                url: 'wss://'+params.host+":"+params.port+"/app/engineData",
                // Notice the non-standard second parameter here, this is how you pass in
                // additional configuration to the 'ws' npm library, if you use a different
                // library you may configure this differently:
                createSocket: url => new WebSocket(url, {
                  ca: [base64decode(params.rootPem)],
                  key: base64decode(params.clientKey),
                  cert: base64decode(params.clientPem),
                  headers: {
                    'X-Qlik-User':`UserDirectory=${encodeURIComponent(params.userDir)};UserId=${encodeURIComponent(params.userName)}`,
                  },
                }),
            }

            enigma.create(enigmaConfig)
            .open()
            .then((qix) => {
                console.log("QIX Engine correctly opened");
                this.qix=qix;  
                fulfill("Initialization done");
            }, err => { 
                console.log(err);
                reject(err)  
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
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

    getSessionDetailsObj() { return this.SessionDetailsObj}
    getSessionDetailsData() { return this.SessionDetailsData }

    getSessionMatrix() {return this.SessionDetailsmatrix}

    serialize(){
        return new Promise( (fulfill, reject) =>{
            serializeapp(this.qdoc)
            .then( info => fulfill(info))
            .catch ( error => reject(error))
        })
        
    }

    getDocList(){
        return new Promise ((fulfill, reject) =>{
            this.qix.getDocList()
            .then( docList =>{
                var MonApp = docList.filter( element =>{ return ((element.qDocName === "Operations Monitor") && (element.qMeta.stream.name === "Monitoring apps"))})
                this.MonApp = MonApp[0].qDocId
                console.log("App Found "+this.MonApp);
                fulfill(MonApp[0]);
            })
            .catch( error => reject(error))
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

    
    getHypercubeData(page) {  

        if(page-1 > 0)
           this.getHypercubeData(--page);    

        var _this=this;
        var p = new Promise ( (fulfill, reject) =>{
                this.Promises.push(
                    this.SessionDetailsObj.getHyperCubeData({qPath: "/qHyperCubeDef",		"qPages": [
                        {
                            "qLeft": 0,
                            "qTop": (page)*900,
                            "qWidth": 11,
                            "qHeight": 900
                        }]})
                    .then(hypercube => {
                        _this.SessionDetailsmatrix.push(hypercube[0].qMatrix);
                         fulfill(hypercube);
                    })
                    .catch( error => {reject(error)})
                )

                Promise.all(this.Promises)
                .then( () =>{
                       fulfill(_this.SessionDetailsmatrix);
                })                
        })
        return p;
    }

}

module.exports = QIX;