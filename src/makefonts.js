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
var extra = require('fs-extra');
var glob = require('glob');
var path=require('path');

exports.make = function (dirs,tmp) {
    var fonts = glob.sync(tmp + '/**/*.ttf');
    fonts = fonts.concat(glob.sync(tmp + '/**/*.woff'));
    fonts = fonts.concat(glob.sync(tmp + '/**/*.eot'));
    
    
    for (var i = 0; i < fonts.length;i++)
        extra.copySync(fonts[i], dirs.fonts+'/'+path.basename(fonts[i]));
}