/*
  Created By Zhongyan QIU, 14/09/15
  UFID: 96962096
  Using Multiple Thread to compute Pi.
*/
var cluster = require('cluster');
if (cluster.isMaster) {
    var workers = [];
    var nrOfElements = 100;
    var nrOfMessages = 500000;
    var nrOfCores = require('os').cpus().length;
    for(var i=0; i<nrOfCores; i++) {
      workers.push(cluster.fork());
    }
    var res= 0.0;
    var msIdx = 0;
    var workersIdx = 0;
    workers[workersIdx].send([msIdx*nrOfElements,nrOfElements]);
    msIdx++;
    workersIdx=(workersIdx++)%nrOfCores;


    cluster.on('message', function(msg){
        console.log('Main Process Listen: ', msg);
        res+=msg;
        if(msIdx>=nrOfMessages){
            console.log("Result is:", res);
            process.exit(0);
        }else{
            workers[workersIdx].send([msIdx*nrOfElements,nrOfElements]);
            msIdx++;
            workersIdx=(workersIdx++)%nrOfCores;
        }

    });

    


    /*process.exit(0);*/
}
else {
    process.on('message', function(msg) {
        var acc = 0.0;
        startIdx = msg[0];
        nrOfElements = msg[1];
        /*
        console.log("startIdx : %d\n", startIdx);
        console.log("nrOfElements : %d\n", nrOfElements);*/
        for (i=startIdx;i<(startIdx + nrOfElements);i++)acc += 4.0 * (1 - (i % 2) * 2) / (2 * i + 1);
        process.send(acc); 
    });   
    /*process.exit(0);*/
}

