/**
 project:* batreh-aspnet-make
 type: buile tool
 company: Borna Mehr Fann. 
 treadmark: Barteh
 Licence: MIT
    description: nodejs library tool for build and bundle asp.net and 
    modern js libraqries like angularjs.
    auther: Ahad Rafat Talebi.
site: www.barteh.ir
 */


var fs = require('fs');



var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.make = function (name, version,dist,dirs) {
    console.log('================ creating dist directories ========>>>>');

    

    var t = fs.existsSync(dist);
    if (!t) {
        fs.mkdirSync(dist);
        console.log('dist directory created');
    }

    var fp = dist + name + '-' + version;

    deleteFolderRecursive(fp);

    fs.mkdirSync(fp);

for(var k=0;k<dirs.length;k++)
    fs.mkdirSync(fp +'/'+ dirs[k]);
  /*  fs.mkdirSync(fp + '/script');
    fs.mkdirSync(fp + '/image');
    fs.mkdirSync(fp + '/css');
    fs.mkdirSync(fp + '/fonts');
    fs.mkdirSync(fp + '/view');
    fs.mkdirSync(fp + '/bin');*/
    //fs.mkdirSync(fp + '/tool');

    var list = fs.readdirSync(fp);




    var ret = {};
    ret.root = fp;
    for (var i = 0; i < list.length; i++)
        ret[list[i]] = fp + '/' + list[i];

    console.log('dist directory for [ ' + fp + " ] created.");

    return ret;

};