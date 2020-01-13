"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class SignalsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/signals');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-signals', 'controller', 'default', '*', '1.0'));
    }
}
exports.SignalsHttpServiceV1 = SignalsHttpServiceV1;
//# sourceMappingURL=SignalsHttpServiceV1.js.map