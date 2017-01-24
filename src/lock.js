var exec = require('sync-exec');
var glob = require('glob').glob;
var path = require('path');
var extra = require('fs-extra');


exports.make = function (root, tmp, tools) {

    tools = tools || 'tools';
    tmp = tmp || 'tmp';

    

    

    
var files=glob.sync(tmp + '/bin/*.*');

var forlock=[];
var others=[];


for(var i=0;i<files.length;i++){
    var b=path.basename(files[i]);
    if(b.match(/^barteh_*|fdate.dll|app_code.dll/gi  )){
            forlock.push(files[i]);
    }
    else if(b.match(/settings.json/)){}

    else{
        others.push(files[i]);
    }

}

    console.log('===== locking dlls ========>>>');

    for (var j = 0; j < forlock.length; j++) {
        
        var n = path.basename(forlock[j]);


        var cmd = tools + '\\reactor\\dotnet_reactor -file ' + tmp
            + '\\bin\\' + n + '    -targetfile '
            + root + '\\bin\\' + n + ' -q';

        var out = exec(cmd).stdout;

        //console.log(cmd);


        console.log(out);



        console.log(n + ' done.');
    }





for(var k=0;k<others.length;k++){
   
     var rel=others[k].replace(tmp+'/','');
     
    extra.copy(others[k],root+'/'+rel);
}

console.log('bin folder made successfully.')

};

