var QIX = require ('./Classes/QIX');

qix = new QIX();

console.log(qix);

qix.init()
.then ( result =>{
    return (qix.getEngineVersion())
})
.then( version =>{
    console.log("Connected to the instance ver." + version.qComponentVersion);
    return qix.openDoc();
})

.then( doc =>{
    return qix.getAllInfos();
})

.then(info =>{
    info.filter( element =>{
        return element.qType="Dimension";
    })
    .forEach( dimension =>{
        return qix.getDimension(dimension.qId)
    })
    
  //  return qix.getObject('KryeNN');
})
/*
.then( obj =>{
    return qix.getHypercubeData()
})
.then( data =>{
    console.log(data);
    data.forEach(element => {
        element.qMatrix.forEach(row =>{
            console.log(row);
        })
    });
})
*/
.catch( error =>{
    console.log("Errore : "+error);
})



