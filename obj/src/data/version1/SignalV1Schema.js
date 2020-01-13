"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class SignalV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('device_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.Integer);
        this.withOptionalProperty('sent', pip_services3_commons_node_2.TypeCode.Boolean);
        this.withOptionalProperty('lock_until', pip_services3_commons_node_2.TypeCode.Long);
    }
}
exports.SignalV1Schema = SignalV1Schema;
//# sourceMappingURL=SignalV1Schema.js.map