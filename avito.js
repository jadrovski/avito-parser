var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec('parser.js');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', function () {
    const fs = require('fs');
    fs.readdir('output', (err, files) => {
        var freshCars = [];
        files.forEach(file => {
            var cars = JSON.parse(fs.readFileSync('output/' + file, 'utf8'));
            cars.forEach(car => {
                if(car.fresh === true) {
                    car.fresh = false;
                    freshCars.push(car);
                    console.log('new! ' + car.url);
                }
            });
            fs.writeFile('output/' + file, JSON.stringify(cars));
        });
        fs.writeFile('output/fresh.json', JSON.stringify(freshCars));
    })
});