var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec('main-casper-parser.js');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', function () {
    // do something on end
});