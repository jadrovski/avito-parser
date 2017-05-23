/// <reference path="./Car.ts" />
/// <reference path="./Transmissions.ts" />
/// <reference path="./Params.ts" />

namespace Avito {
    export class UrlBuilder {
        public static build(city:string, car:Car, carModel:string) {
            let params:Array<Param> = [];

            const transmissions = car.transmissions.map(function(tr) {
                return Transmissions[tr];
            });
            params.push(new Param(Params.Transmission, ParamValueTypes.Selection, transmissions));

            const paramsStrings = params.map(function(param:Param) {
                return param.build();
            });
            const paramsGlued = paramsStrings.join('.');
            return `${this.getBaseUrl()}/${city}/avtomobili/${car.name}/${carModel}?f=${paramsGlued}`;
        }

        public static getBaseUrl() {
            return 'https://www.avito.ru';
        }
    }
}