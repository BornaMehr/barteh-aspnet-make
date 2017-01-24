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

exports.reversion = function (pkg, pKind,sourceWebProj) {
    pKind = pKind || '';


    incVersion(pkg, pKind);

    var newver = pkg.version;


    modules = ['main', 'abc', 'prod', 'dashboard', 'bpm', 'data', 'organization'];

    var ver = newver.split('.');
    vertext = ver[0] + '.' + ver[1];// + '.' + ver[2];

    //var txt = fs.readFileSync('../barteh_collection/barteh_webapp/properties/assemblyinfo.cs', 'utf8');
    var txt = fs.readFileSync(sourceWebProj+'/properties/assemblyinfo.cs', 'utf8');
    var lines = txt.split('\r\n');


    txt = setver(lines, vertext);

    if (txt.changed) {
        fs.writeFileSync('../barteh_collection/barteh_webapp/properties/assemblyinfo.cs', txt.file, 'utf8');

        console.log('barteh_webapp reversioned  to: ' + newver);
    }

    for (var j = 0; j < modules.length; j++) {

        var txt = fs.readFileSync('../barteh_collection/barteh_module_' + modules[j] + '/properties/assemblyinfo.cs', 'utf8');

        var lines = txt.split('\r\n');


        txt = setver(lines, vertext);

        if (txt.changed) {
            fs.writeFileSync('../barteh_collection/barteh_module_' + modules[j] + '/properties/assemblyinfo.cs', txt.file, 'utf8');
            console.log('module: ' + modules[j] + ' reversioned  to: ' + newver);
        }
    }

    console.log("========= reversioning completed.");



}

function incVersion(pkg, pKind) {
    console.log(pKind)
    var ver = pkg.version.split('.');


    switch (pKind) {
        case '-b':
            ver[2] = Number(ver[2]) + 1;
            break;
        case '-f':
            ver[2] = 0;
            var ff = Number(ver[1]);
            if (ff === 0)
                ver[1] = 11;
            else
                ver[1] = ff + 1;
            break;
        case '-m':
            ver[2] = 0;
            ver[1] = 0;
            ver[0] = Number(ver[0]) + 1;

            break;



    }

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var dt = year + "/" + month + "/" + day + "-" + hour + ":" + min + ":" + sec;

    pkg.barteh = pkg.barteh || {};
    pkg.barteh.buildTime = dt;
    if (pKind !== "")
        pkg.version = ver.join('.');
    console.log(ver)

    fs.writeFileSync('package.json', JSON.stringify(pkg), 'utf8');
}


function setver(lines, ver) {
    var ret = [];
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/^\/\//) || lines[i].match(/AssemblyFileVersion*/g))
            continue;


        if (lines[i].match(/AssemblyVersion*/g)) {
            var exver = lines[i].match(/\d+(\.\d+)+/);
            var parts = exver.input.substr(exver.index, exver.input.length).split('.');

            var changed = false;
            if (parts.length > 0) {
                parts[parts.length - 1] = parts[parts.length - 1][0];
            }
            var ex = parts[0] + '.' + parts[1];

            if (ex !== ver) {
                changed = true;
                lines[i] = '[assembly:AssemblyVersion("' + ver + '.*")]';
                lines[i] = unescape(encodeURIComponent(lines[i]));
            }

        }


        ret.push(lines[i]);
    }

    return { file: ret.join('\r\n'), changed: changed };
}


