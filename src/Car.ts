/// <reference path="./Price.ts" />

namespace Avito {
    export interface Car {
        name:string;
        models:Array<string>;
        transmissions:Array<string>;
        price:Price;
        years:Years;
    }
}