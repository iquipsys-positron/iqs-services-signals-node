"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const SignalV1Schema_1 = require("../data/version1/SignalV1Schema");
class SignalsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetSignalsCommand());
        this.addCommand(this.makeSendSignalCommand());
        this.addCommand(this.makeLockSignalCommand());
        this.addCommand(this.makeMarkSignalSentCommand());
        this.addCommand(this.makeDeleteSignalByIdCommand());
    }
    makeGetSignalsCommand() {
        return new pip_services3_commons_node_2.Command("get_signals", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getSignals(correlationId, filter, paging, callback);
        });
    }
    makeSendSignalCommand() {
        return new pip_services3_commons_node_2.Command("send_signal", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('signal', new SignalV1Schema_1.SignalV1Schema()), (correlationId, args, callback) => {
            let signal = args.get("signal");
            this._logic.sendSignal(correlationId, signal, callback);
        });
    }
    makeLockSignalCommand() {
        return new pip_services3_commons_node_2.Command("lock_signal", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('signal_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let signalId = args.getAsNullableString("signal_id");
            this._logic.lockSignal(correlationId, signalId, (err, result) => {
                callback(err, result != null ? { result: result } : null);
            });
        });
    }
    makeMarkSignalSentCommand() {
        return new pip_services3_commons_node_2.Command("mark_signal_sent", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('signal_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let signalId = args.getAsNullableString("signal_id");
            this._logic.markSignalSent(correlationId, signalId, (err, result) => {
                callback(err, result != null ? { result: result } : null);
            });
        });
    }
    makeDeleteSignalByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_signal_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('signal_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let signalId = args.getAsNullableString("signal_id");
            this._logic.deleteSignalById(correlationId, signalId, callback);
        });
    }
}
exports.SignalsCommandSet = SignalsCommandSet;
//# sourceMappingURL=SignalsCommandSet.js.map