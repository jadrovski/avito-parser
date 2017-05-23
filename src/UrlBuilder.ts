/// <reference path="./Car.ts" />
/// <reference path="./Transmissions.ts" />
/// <reference path="./Params.ts" />
/// <reference path="./Years.ts" />

namespace Avito {
    export class UrlBuilder {
        public static build(city:string, car:Car, carModel:string) {
            let params:Array<Param> = [];

            if (car.transmissions.length) {
                const transmissions = car.transmissions.map(function (tr) {
                    return Transmissions[tr];
                });
                params.push(new Param(Params.Transmission, ParamValueTypes.Selection, transmissions));
            }
            params.push(new Param(Params.Year, ParamValueTypes.Range, [Years.getYearId(car.years.min), Years.getYearId(car.years.max)]));

            const paramsStrings = params.map(function (param:Param) {
                return param.build();
            });
            const paramsGlued = paramsStrings.join('.');
            return `${this.getBaseUrl()}/${city}/avtomobili/${car.name}/${carModel}?f=${paramsGlued}&pmin=${car.price.min}&pmax=${car.price.max}`;
        }

        public static getBaseUrl() {
            return 'https://www.avito.ru';
        }
    }
}