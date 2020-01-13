"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const SignalsServiceFactory_1 = require("../build/SignalsServiceFactory");
class SignalsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("signals", "Device signals microservice");
        this._factories.add(new SignalsServiceFactory_1.SignalsServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.SignalsProcess = SignalsProcess;
//# sourceMappingURL=SignalsProcess.js.map