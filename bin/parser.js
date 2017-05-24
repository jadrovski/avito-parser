var Avito;
(function (Avito) {
    var years = {
        'от 1980 г.в.': '',
        'до 1960': '771',
        '1970': '782',
        '1980': '873',
        '1985': '878',
        '1990': '883',
        '1991': '884',
        '1992': '885',
        '1993': '886',
        '1994': '887',
        '1995': '888',
        '1996': '889',
        '1997': '890',
        '1998': '891',
        '1999': '892',
        '2000': '893',
        '2001': '894',
        '2002': '895',
        '2003': '896',
        '2004': '897',
        '2005': '898',
        '2006': '899',
        '2007': '900',
        '2008': '901',
        '2009': '902',
        '2010': '2844',
        '2011': '2845',
        '2012': '6045',
        '2013': '8581',
        '2014': '11017',
        '2015': '13978',
        '2016': '16381',
        '2017': '19775'
    };
    var Years = (function () {
        function Years() {
        }
        return Years;
    }());
    Years.getYearId = function (name) {
        return years[name];
    };
    Avito.Years = Years;
})(Avito || (Avito = {}));
/// <reference path="./Price.ts" />
/// <reference path="./Years.ts" />
var Avito;
(function (Avito) {
    var Params;
    (function (Params) {
        Params[Params["Transmission"] = 185] = "Transmission";
        Params[Params["Year"] = 188] = "Year";
        Params[Params["Mileage"] = 1375] = "Mileage";
    })(Params = Avito.Params || (Avito.Params = {}));
    var ParamValueTypes;
    (function (ParamValueTypes) {
        ParamValueTypes[ParamValueTypes["Range"] = 0] = "Range";
        ParamValueTypes[ParamValueTypes["Selection"] = 1] = "Selection";
    })(ParamValueTypes = Avito.ParamValueTypes || (Avito.ParamValueTypes = {}));
    var Param = (function () {
        function Param(param, type, values) {
            var _this = this;
            this.param = param;
            this.type = type;
            this.values = values;
            this.build = function () {
                var val;
                if (_this.type === ParamValueTypes.Range) {
                    if (_this.values.length !== 2) {
                        throw Error(_this.param + " " + _this.type + " values length must be 2");
                    }
                    val = _this.values[0] + "b" + _this.values[1];
                }
                else if (_this.type === ParamValueTypes.Selection) {
                    val = _this.values.join('-');
                }
                else {
                    throw Error('Undefined parameter value type');
                }
                return _this.param + "_" + val;
            };
        }
        return Param;
    }());
    Avito.Param = Param;
})(Avito || (Avito = {}));
var Avito;
(function (Avito) {
    var Transmissions;
    (function (Transmissions) {
        Transmissions[Transmissions["MT"] = 861] = "MT";
        Transmissions[Transmissions["AT"] = 860] = "AT";
    })(Transmissions = Avito.Transmissions || (Avito.Transmissions = {}));
})(Avito || (Avito = {}));
/// <reference path="./Car.ts" />
/// <reference path="./Car.ts" />
/// <reference path="./Transmissions.ts" />
/// <reference path="./Params.ts" />
/// <reference path="./Years.ts" />
var Avito;
(function (Avito) {
    var UrlBuilder = (function () {
        function UrlBuilder() {
        }
        UrlBuilder.build = function (city, car, carModel) {
            var params = [];
            if (car.transmissions.length) {
                var transmissions = car.transmissions.map(function (tr) {
                    return Avito.Transmissions[tr];
                });
                params.push(new Avito.Param(Avito.Params.Transmission, Avito.ParamValueTypes.Selection, transmissions));
            }
            params.push(new Avito.Param(Avito.Params.Year, Avito.ParamValueTypes.Range, [Avito.Years.getYearId(car.years.min), Avito.Years.getYearId(car.years.max)]));
            var paramsStrings = params.map(function (param) {
                return param.build();
            });
            var paramsGlued = paramsStrings.join('.');
            return this.getBaseUrl() + "/" + city + "/avtomobili/" + car.name + "/" + carModel + "?f=" + paramsGlued + "&pmin=" + car.price.min + "&pmax=" + car.price.max + "&user=1";
        };
        UrlBuilder.getBaseUrl = function () {
            return 'https://www.avito.ru';
        };
        return UrlBuilder;
    }());
    Avito.UrlBuilder = UrlBuilder;
})(Avito || (Avito = {}));
/// <reference path="./Transmissions.ts" />
/// <reference path="./Settings.ts" />
/// <reference path="./UrlBuilder.ts" />
/// <reference path="./../CarOutput.ts" />
var Avito;
(function (Avito) {
    phantom['casperPath'] = 'node_modules/casperjs';
    phantom.injectJs(phantom['casperPath'] + '/bin/bootstrap.js');
    require('phantomjs-polyfill-find');
    var fs = require('fs');
    var settings = require('./settings.avito.json');
    var casper = require('casper').create({
        pageSettings: {
            loadImages: false,
            loadPlugins: false
        },
        viewportSize: {
            width: 1024,
            height: 768
        },
        waitTimeout: 10000
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
                var url = Avito.UrlBuilder.build(city, car, carModel);
                var cars = [];
                fetchCars(casper, url, cars);
                casper.then(function () {
                    console.log(" - saving...");
                    saveCars(cars, "output/" + city + "-" + car.name + "-" + carModel + ".json");
                    console.log("total of " + city + ", " + car.name + " " + carModel + ": " + cars.length);
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
                casper.echo("new link! " + carNew.url);
                carsOld.push(carNew);
            }
            else {
                if (found.price != carNew.price) {
                    if (typeof found.priceHistory === 'undefined') {
                        found.priceHistory = [];
                    }
                    found.priceHistory.push(found.price);
                    found.price = carNew.price;
                    casper.echo("price changed! " + carNew.url);
                }
            }
        });
        /*casper.each(carsOld, function (self, carOld) {
            if (!cars.find(function (car) {
                    return car.url === carOld.url;
                })) {
                casper.echo(`deprecated! ${carOld.url}`);
                carOld.deprecated = true;
            }
        });*/
        fs.write(fileName, JSON.stringify(carsOld), 'w');
    }
    function fetchCars(casper, url, cars) {
        console.log("going to url: " + url);
        casper.thenOpen(url, function () {
            console.log(" - waiting for catalog...");
            casper.waitForSelector('.catalog_table', function () {
                console.log(" - parsing entities...");
                var parsedCars = casper.evaluate(function () {
                    var cars = [];
                    var sel = $('.item_table');
                    $.each(sel, function (key, val) {
                        var $item = $(val);
                        var fullDescription = $item.find('.about').text().split('\n');
                        var price = fullDescription[1].trim();
                        var description = fullDescription[2].trim();
                        var image = $item.find('.photo-wrapper > img').data('srcpath');
                        if (!image) {
                            image = $item.find('.photo-wrapper > img').attr('src');
                        }
                        cars.push({
                            url: $item.find('.item-description-title-link').attr('href'),
                            photo: image,
                            description: description,
                            price: price,
                            fresh: true
                        });
                    });
                    return cars;
                });
                cars.push.apply(cars, parsedCars);
                if (this.exists('.js-pagination-next')) {
                    var href = Avito.UrlBuilder.getBaseUrl() + casper.getElementAttribute('.js-pagination-next', 'href');
                    var fetchedNextCars = fetchCars(casper, href, cars);
                    cars.push.apply(cars, fetchedNextCars);
                }
            });
        });
        return cars;
    }
    casper.run();
})(Avito || (Avito = {}));
