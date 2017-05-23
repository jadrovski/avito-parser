"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlBuilder = (function () {
    function UrlBuilder() {
    }
    UrlBuilder.build = function (city, car, carModel) {
        return this.getBaseUrl() + "/" + city + "/avtomobili/" + car.name + "/" + carModel + "?f="; //$('input[name="params[185][]"][value=861]').click()
    };
    UrlBuilder.getBaseUrl = function () {
        return 'https://www.avito.ru';
    };
    return UrlBuilder;
}());
exports.UrlBuilder = UrlBuilder;
