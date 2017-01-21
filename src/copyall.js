var glob=require('glob').glob;
var path=require('path');
var fs=require('fs');

var extra=require('fs-extra');
var htmlminify = require('html-minifier').minify;
var uglifyjs = require('uglify-js');
var CleanCSS = require('clean-css');

'use strict';
exports.copy=function(arr, root, tmp,watermark){
var list=[];
if(typeof arr !== 'array'){
    for(var i=0;i<arr.length;i++){
        list.push(tmp+'/'+arr[i]);
    }
    if(doforarray(list, root, tmp,watermark))
        console.log(arr+' is copeid successfully')
    return    true;
}
else{
     return false;
}



}


exports.deepcopy=function( source, root, tmp,watermark){


if(!source){
    return false;
    }
if(source===''){
    return false;
    }
    if(!root){
        return false;
        }
        if(root===''){
        return false;
        }
tmp= tmp || '../barteh_collection\tmp';
watermark=watermark || 'BornamehrFann. barteh ';

var all=[];
all=glob.sync(tmp+'/'+source+'/**/*.*');
doforarray(all, root, tmp,watermark);
console.log(source+' is copeid successfully')
}
function doforarray(all, root, tmp,watermark){
    
var htmls=[];
var jss=[];
var csss=[];
var bins=[];
for(var i=0;i<all.length;i++){
    let f=all[i];
    let ext=path.extname(f);
    if(ext==='.html' || ext==='.htm' ){
        htmls.push(all[i]);
        continue;
        }
    else if(ext==='.js'){
        jss.push(all[i]);
        continue;
        }
    else if(ext==='.css'){
        csss.push(all[i]);
        continue;
        }
        else{
            bins.push(all[i]);
        }

}


////////// html

var txt='';
var hw='<!--'+watermark+'-->\n';
for(var i=0;i<htmls.length;i++){
    

    var intxt=fs.readFileSync(htmls[i],'utf8');
    
txt = unescape(encodeURIComponent(hw));
    txt+=htmlminify(intxt, {
            removeComments: true,
            removeTagWhitespace: true,
            collapseWhitespace: true
        });
 var rel=htmls[i].replace(tmp+'/','');
extra.outputFileSync(root+'/'+rel,txt,'utf8');
    
}

////////////// script
var jsw='/*\n'+watermark+'\n*/\n';
for(var i=0;i<jss.length;i++){
    
    
txt = unescape(encodeURIComponent(jsw));
var puk=[jss[i]];
 var result = uglifyjs.minify(puk, {
            mangle: true,
            compress: {

                //dead_code: true,
                global_defs: {
                    DEBUG: false
                }
            }
        });
txt+=result.code;
    
 var rel=jss[i].replace(tmp+'/','');
 
 extra.outputFileSync(root+'/'+rel,txt,'utf8');
    
}
//////////////// css

for(var i=0;i<csss.length;i++){
    
 
    var intxt=fs.readFileSync(csss[i],'utf8');
    
txt = unescape(encodeURIComponent(jsw));

 txt+=new CleanCSS().minify(intxt).styles;
    
 var rel=csss[i].replace(tmp+'/','');
 
extra.outputFileSync(root+'/'+rel,txt,'utf8');
    
}

///// bins

for(var i=0;i<bins.length;i++){
 var intxt=fs.readFileSync(bins[i]);
 var rel=bins[i].replace(tmp+'/','');
 
extra.outputFileSync(root+'/'+rel,intxt);
    
}







}