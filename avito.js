var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec('parser.js');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', function () {
});