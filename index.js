exports.lock = require('./src/lock').make;
exports.makeHtml = require('./src/makestatichtml').make;
exports.makedist = require('./src/makedistdir').make;
exports.makefonts = require('./src/makefonts').make;
exports.reversion = require('./src/setversion').reversion;
let cpall=require('./src/copyall');

exports.deepcopy=cpall.deepcopy;
exports.copy=cpall.copy;