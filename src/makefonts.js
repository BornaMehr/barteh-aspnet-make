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