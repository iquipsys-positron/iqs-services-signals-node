"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const SignalsCommandSet_1 = require("./SignalsCommandSet");
class SignalsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(SignalsController._defaultConfig);
        this._lockDuration = 5000;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._lockDuration = config.getAsIntegerWithDefault('options.lock_duration', this._lockDuration);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        //!!this._mqttGatewayClient = this._dependencyResolver.getOneOptional<IMqttGatewayClientV1>('mqttgateway');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new SignalsCommandSet_1.SignalsCommandSet(this);
        return this._commandSet;
    }
    getSignals(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    sendSignal(correlationId, signal, callback) {
        signal.time = new Date();
        signal.sent = false;
        signal.lock_until = 0;
        async.series([
            // Send to MQTT gateway
            (callback) => {
                // if (this._mqttGatewayClient == null) {
                //     callback();
                // } else if (signal.device_id) {
                //     this._mqttGatewayClient.sendSignal(
                //         correlationId, signal.org_id, signal.device_id,
                //         signal.type, signal.time.getTime() / 1000,
                //         (err, result) => {
                //             signal.sent = !!result;
                //             callback(err);
                //         }
                //     );
                // } else {
                //     this._mqttGatewayClient.broadcastSignal(
                //         correlationId, signal.org_id,
                //         signal.type, signal.time.getTime() / 1000,
                //         (err, result) => {
                //             signal.sent = !!result;
                //             callback(err);
                //         }
                //     );
                // }
                callback();
            },
            (callback) => {
                // Save the signal
                this._persistence.create(correlationId, signal, (err, data) => {
                    signal = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? signal : null);
        });
    }
    lockSignal(correlationId, signal_id, callback) {
        this._persistence.lock(correlationId, signal_id, this._lockDuration, callback);
    }
    markSignalSent(correlationId, signal_id, callback) {
        let data = pip_services3_commons_node_3.AnyValueMap.fromTuples('sent', true, 'lock_until', 0);
        this._persistence.updatePartially(correlationId, signal_id, data, (err, signal) => {
            let result = signal && signal.sent;
            callback(err, result);
        });
    }
    deleteSignalById(correlationId, id, callback) {
        this._persistence.deleteById(correlationId, id, callback);
    }
}
exports.SignalsController = SignalsController;
SignalsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-signals:persistence:*:*:1.0', 'dependencies.mqttgateway', 'iqs-services-mqttgateway:client:*:*:1.0');
//# sourceMappingURL=SignalsController.js.map