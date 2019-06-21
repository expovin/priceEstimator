var QIX = require ('./Classes/QIX');

qix = new QIX();

qix.init()
.then( () =>{
    
    qix.getDocList()
    .then( docList =>{
        console.log(docList)
    })
    
    
})



