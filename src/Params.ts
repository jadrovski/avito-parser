namespace Avito {
    export enum Params {
        Transmission = 185,
        Year = 188,
        Mileage = 1375
    }

    export enum ParamValueTypes {
        Range,
        Selection
    }

    export class Param {
        constructor(public param:Params, public type:ParamValueTypes, public values:Array<string>) {
        }

        public build = () => {
            let val:string;
            if (this.type === ParamValueTypes.Range) {
                if (this.values.length !== 2) {
                    throw Error(`${this.param} ${this.type} values length must be 2`);
                }
                val = `${this.values[0]}b${this.values[1]}`;
            } else if (this.type === ParamValueTypes.Selection) {
                val = this.values.join('-');
            } else {
                throw Error('Undefined parameter value type');
            }
            return `${this.param}_${val}`;
        };
    }
}