var QIX = require ('./Classes/QIX');

qix = new QIX();

qix.init()
.then( () =>{
    console.log(qix.getBookmarks())
})



