const fs = require('fs');

const obj = [];

async function readJson(){
    console.log('Starting script...');

    await fs.readFile('data.json', (err, data) => {
        if(err){
        console.log('ERROR: Dont found data.json file.');
        return
        }
        console.log('Reading data.json file...');
        
        let x = JSON.parse(data);
        console.log('Loading data object...');
        console.log('______')
        var count = Object.keys(x).length;
        var p = x.products;
        var t = x.terms;
        var count = 0;
        Object.keys(p).forEach(function(y){
            console.log('searching by productFamily '+ y);
            var pf = p[y].productFamily;
            if(pf == 'Compute Instance'){
                let jsn = { 
                    sku: p[y].sku,
                    instanceType: p[y].attributes.instanceType,
                    location: p[y].attributes.location,
                    instanceFamily: p[y].attributes.instanceFamily,
                    vcpu: p[y].attributes.vcpu,
                    memory: p[y].attributes.memory,
                    storage: p[y].attributes.storage,
                    operatingSystem: p[y].attributes.operatingSystem
                };
                obj.push(jsn);
                count+=1;
            }
        })
        console.log("Dump for "+ count+" values.");

        var sql = "INSERT INTO awsflavors "+
        "('instanceType', 'location', 'instanceFamily', 'vcpu', 'memory', 'operatingSystem', 'storage') "
        +"VALUES ";

        obj.forEach(x => {
            sql+= "('"+x.instanceType+"',";
            sql+= "'"+x.location+"',";
            sql+= "'"+x.instanceFamily+"',";
            sql+= "'"+x.vcpu+"',";
            sql+= "'"+x.memory+"',";
            sql+= "'"+x.storage+"',";
            sql+= "'"+x.operatingSystem+"'), ";
        });

        var nsql = sql.substr(0,(sql.length - 2));
        sql = nsql;
        sql+= ";";

        console.log('Creating .SQL file...');

        fs.appendFile('dumpAws.sql', sql, function (err) {
            if (err) throw err;
            console.log('SQL dump is created successfully.');
          }); 

        console.log('______');
        console.log('Development by lucaswiix')
        console.log('______')
        console.log('End');
    });
}


readJson();

