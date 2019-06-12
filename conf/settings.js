
var config = {
    wsPort : 1337,

    QIX : {
        host: 'qmi-qs-qib',
        port: 4747,
        QRSPort : 4242,
        ProxyPort: 4243,
        userDir : 'qmi-qs-qib',
        userName: 'qlik',
        certsPath : '../certs',
        proxyTketPath : "/qps/pbg/ticket?xrfkey=",
        OPMON : "19f5cbad-58ec-4e44-ad20-f7c643682e52"
    }

}

module.exports = function(){

    if(process.env.NODE_ENV === "production"){
        console.log("Ambiente di produzione. Cambio parametri");
    }
    
    return (config);
}