phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

require('phantomjs-polyfill-find');
var fs = require('fs');
var settings = require('./settings.json');
var parseTable = require('./parse-table');

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    viewportSize: {
        width: 1024,
        height: 768
    }
});
casper.start();

var block_urls = ['yandex.ru', 'about:blank', 'googlesyndication', 'doubleclick', 'criteo.com'];
casper.on('resource.requested', function (requestData, request) {
    for (var url in block_urls) {
        if (requestData.url.indexOf(block_urls[url]) !== -1) {
            request.abort();
            return;
        }
    }
});

casper.each(settings.cities, function (self, city) {
    casper.each(settings.cars, function (self, car) {
        //noinspection JSUnresolvedVariable
        casper.each(car.models, function (self, carModel) {
            var url = 'https://www.avito.ru/' + city + '/avtomobili/' + car.name + '/' + carModel;
            var cars = [];
            fetchCars(casper, url, cars);
            casper.then(function () {
                console.log(' - saving...');
                saveCars(cars, 'output/' + city + '-' + car.name + '-' + carModel + '.json');
                console.log('total of ' + city + ', ' + car.name + ' ' + carModel + ': ' + cars.length);
            });
        });
    });
});

function saveCars(cars, fileName) {
    //casper.capture('shots/' + carFileName + '.png');

    if (!fs.exists(fileName)) {
        fs.write(fileName, JSON.stringify(cars), 'w');
        return;
    }

    var carsOld = JSON.parse(fs.read(fileName));
    casper.each(cars, function (self, carNew) {
        var found = carsOld.find(function (car) {
            return car.url === carNew.url;
        });
        if (!found) {
            casper.echo('new link! ' + carNew.url);
            carsOld.push(carNew);
        } else {
            if (found.price != carNew.price) {
                if (typeof found.priceHistory === 'undefined') {
                    found.priceHistory = [];
                }
                found.priceHistory.push(found.price);
                found.price = carNew.price;
                casper.echo('price changed! ' + carNew.url);
            }
        }
    });
    casper.each(carsOld, function (self, carOld) {
        if (!cars.find(function (car) {
                return car.url === carOld.url;
            })) {
            casper.echo('deprecated! ' + carOld.url);
            carOld.deprecated = true;
        }
    });
    fs.write(fileName, JSON.stringify(carsOld), 'w');
}

function fetchCars(casper, url, cars) {
    console.log('going to url: ' + url);
    casper.thenOpen(url, function () {
        console.log(' - waiting for catalog...');
        casper.waitForSelector('.catalog_table', function () {
            console.log(' - parsing entities...');
            var parsedCars = parseTable(casper);
            cars.push.apply(cars, parsedCars);
            if (this.exists('.js-pagination-next')) {
                var href = 'https://www.avito.ru' + casper.getElementAttribute('.js-pagination-next', 'href');
                var fetchedNextCars = fetchCars(casper, href, cars);
                cars.push.apply(cars, fetchedNextCars);
            }
        });
    });
    return cars;
}

casper.run();