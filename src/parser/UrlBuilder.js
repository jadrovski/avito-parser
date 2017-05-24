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
