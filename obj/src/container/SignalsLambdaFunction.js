"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const SignalsServiceFactory_1 = require("../build/SignalsServiceFactory");
class SignalsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("signals", "Device signals function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-signals', 'controller', 'default', '*', '*'));
        this._factories.add(new SignalsServiceFactory_1.SignalsServiceFactory());
    }
}
exports.SignalsLambdaFunction = SignalsLambdaFunction;
exports.handler = new SignalsLambdaFunction().getHandler();
//# sourceMappingURL=SignalsLambdaFunction.js.map