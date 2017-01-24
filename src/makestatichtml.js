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
var jsdom = require('jsdom');
var path = require('path');
var uglifyjs = require('uglify-js');
var minify = require('html-minifier').minify;

var CleanCSS = require('clean-css');






//exports.make = function (root, input, options.tmp, options.watermark) {
exports.make = function (input, root, options) {
    if (!input)
        return false;
    if (input == '')
        return false;
    if (!options)
        return false;
    if (!root)
        return false;

    options.tmp = options.tmp || 'tmp';
    options.watermark =options.watermark || "barteh software. Borna Mehr Fann co. www.barteh.ir";
    var basename = path.basename(input);


    var own_script_file_name = options.ownScript || basename + '.js';
    var vendor_script_file_name = options.vendorScript || basename + '_vendor.js';

    var own_style_file_name = options.ownStyle || basename + '.css';
    var vendor_style_file_name = options.vendorStyle || basename + '_vendor.css';



    var vendor_scripts = [];
    var own_scripts = [];
    var vendor_csss = [];
    var own_csss = [];





    var file = fs.readFileSync(options.tmp + '/' + input, 'utf8');

    jsdom.env(file, function (er, window) {
        var $ = require("jquery")(window);
        var scripts = $('script[src]')
        var h = scripts.filter(function (a, b) {
            if (b.src)
                return b.src.match(/^tool\/external/);
            else
                return false;

        });

        for (var i = 0; i < h.length; i++)
            vendor_scripts.push(options.tmp + '/' + h[i].getAttribute('src'));

        h = scripts.filter(function (a, b) {
            if (b.src)
                return !b.src.match(/^tool\/external/);
            else
                return true;

        });

        for (var i = 0; i < h.length; i++)
            own_scripts.push(options.tmp + '/' + h[i].getAttribute('src'));

        scripts.remove();







        /////////css

        var csss = $('link[rel="stylesheet"]');
        h = csss.filter(function (a, b) {
            if (b.href)
                return b.href.match(/^tool\/external/);
            else
                return false;

        });
        for (var i = 0; i < h.length; i++)
            vendor_csss.push(options.tmp + '/' + h[i].getAttribute('href'));

        h = csss.filter(function (a, b) {
            if (b.href)
                return !b.href.match(/^tool\/external/);
            else
                return true;

        });

        for (var i = 0; i < h.length; i++)
            own_csss.push(options.tmp + '/' + h[i].getAttribute('href'));



        var styles = $('style');
        var local_style = styles.text();
        styles.remove();
        csss.remove();



        var hd = $('head');
        var document = window.document;


        /**************/

        
        var ss = window.document.createElement("link");
        ss.rel = 'stylesheet';
        ss.href = 'css/' + vendor_style_file_name;
        document.head.appendChild(ss);


        var s = window.document.createElement("script");
        s.type = "text/javascript";

        s.src = 'script/' + vendor_script_file_name;
        document.head.appendChild(s);

        
        ss = window.document.createElement("link");
        ss.rel = 'stylesheet';
        ss.href = 'css/' + own_style_file_name;
        document.head.appendChild(ss);


        s = window.document.createElement("script");
        s.type = "text/javascript";

        s.src = 'script/' + own_script_file_name;
        document.head.appendChild(s);

        /****************/




        //hd.append('<script src="script/' + own_script_file_name + '" type="text/javascript"></script>');




        //hd.prepend('<link href="css/' + own_style_file_name + '" rel="stylesheet" />');
        //hd.prepend('<script src="script/' + vendor_script_file_name + '" type="text/javascript"></script>');
        //hd.prepend('<link href="css/' + vendor_style_file_name + '" rel="stylesheet" />');

        if (!$('meta[charset="utf-8"]').length)
            hd.prepend('<meta charset="utf-8">');

        var doc = "<!-- " + options.watermark + "-->";
        doc += "<!DOCTYPE html><html ";



        doc = unescape(encodeURIComponent(doc));
        var attrs = $('html')[0].attributes;
        for (var j = 0; j < attrs.length; j++) {
            doc += attrs[j].name + '="' + attrs[j].value + '"';
        }
        doc += ">";

        doc += minify($('html').html(), {
            removeComments: true,
            removeTagWhitespace: true,
            collapseWhitespace: true
        });
        doc += "</html>"

        fs.writeFileSync(root + "/" + path.basename(input), doc, "utf8");

        //////////// bundle js

        var txt = '/*\n' + options.watermark + '*/\n';
        txt = unescape(encodeURIComponent(txt));

        for (var j = 0; j < vendor_scripts.length; j++) {
            var name = vendor_scripts[j];
            txt += '\n/*' + path.basename(name) + '\n';
            txt += fs.readFileSync(name, 'utf8');
        }

        fs.writeFileSync(root + "/script/" + vendor_script_file_name, txt, "utf8");



        var result = uglifyjs.minify(own_scripts, {
            mangle: false,
            compress: {

                //dead_code: true,
                global_defs: {
                    DEBUG: false
                }
            }
        });

        txt = '/*\n' + options.watermark + '*/\n';
        txt = unescape(encodeURIComponent(txt));
        txt += result.code;
        fs.writeFileSync(root + "/script/" + own_script_file_name, txt, "utf8");

        ////////// bundle  css s 

        txt = "/*!\n" + options.watermark + "*/\n\n\t";
        txt = unescape(encodeURIComponent(txt));

        var yup = "";
        for (var k = 0; k < vendor_csss.length; k++) {
            yup += fs.readFileSync(vendor_csss[k], 'utf8');
        }
        txt += yup.replace('/*!', '/*');

        var outt = "";

        outt = new CleanCSS().minify(txt).styles;

        fs.writeFileSync(root + "/css/" + vendor_style_file_name, outt, "utf8");

        /****************** own css *****************/
        txt = "/*!\n" + options.watermark + "*/\n";
        txt += local_style;
        txt = unescape(encodeURIComponent(txt));


        yup = "";
        for (var k = 0; k < own_csss.length; k++) {
            yup += fs.readFileSync(own_csss[k]);
        }
        txt += yup.replace('/*!', '/*');

        outt = new CleanCSS().minify(txt).styles;

        fs.writeFileSync(root + "/css/" + own_style_file_name, outt, "utf8");

        console.log(input + ' has been created');
        return true;

    });










};

