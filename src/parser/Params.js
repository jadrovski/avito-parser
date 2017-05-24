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
