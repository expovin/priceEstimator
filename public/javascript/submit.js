/*document.getElementById("submitAssess").onclick = assessClick();*/


function assessClick() {
    var hostname = document.getElementById("hostname").innerHTML;
    console.log(hostname);
    var port = document.getElementById("port").innerHTML;
    var userName = document.getElementById("username").innerHTML;
    var userDir = document.getElementById("userDirectory").innerHTML;
    var rootpem = document.getElementById("rootpem").files;
    var clientpem = document.getElementById("clientpem").files;
    var clientkeypem = document.getElementById("clientkeypem").files;


    var data = { hostname: hostname, port: port, userName: userName, userDir:userDir, rootpem:rootpem,  clientpem:clientpem, clientkeypem:clientkeypem };
    console.log(clientpem);
    console.log(data);
    /*return JSON.stringify(data);*/
};



/*$('form').serialize() */