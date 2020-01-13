import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { SignalV1 } from '../data/version1/SignalV1';
import { SignalV1Schema } from '../data/version1/SignalV1Schema';
import { ISignalsController } from './ISignalsController';

export class SignalsCommandSet extends CommandSet {
    private _logic: ISignalsController;

    constructor(logic: ISignalsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetSignalsCommand());
		this.addCommand(this.makeSendSignalCommand());
		this.addCommand(this.makeLockSignalCommand());
		this.addCommand(this.makeMarkSignalSentCommand());
		this.addCommand(this.makeDeleteSignalByIdCommand());
    }

	private makeGetSignalsCommand(): ICommand {
		return new Command(
			"get_signals",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getSignals(correlationId, filter, paging, callback);
            }
		);
	}

	private makeSendSignalCommand(): ICommand {
		return new Command(
			"send_signal",
			new ObjectSchema(true)
				.withRequiredProperty('signal', new SignalV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let signal = args.get("signal");
                this._logic.sendSignal(correlationId, signal, callback);
            }
		);
	}

	private makeLockSignalCommand(): ICommand {
		return new Command(
			"lock_signal",
			new ObjectSchema(true)
				.withRequiredProperty('signal_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let signalId = args.getAsNullableString("signal_id");
                this._logic.lockSignal(correlationId, signalId, (err, result) => {
					callback(err, result != null ? { result: result } : null);
				});
			}
		);
	}

	private makeMarkSignalSentCommand(): ICommand {
		return new Command(
			"mark_signal_sent",
			new ObjectSchema(true)
				.withRequiredProperty('signal_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let signalId = args.getAsNullableString("signal_id");
                this._logic.markSignalSent(correlationId, signalId, (err, result) => {
					callback(err, result != null ? { result: result } : null);
				});
			}
		);
	}
	
	private makeDeleteSignalByIdCommand(): ICommand {
		return new Command(
			"delete_signal_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('signal_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let signalId = args.getAsNullableString("signal_id");
                this._logic.deleteSignalById(correlationId, signalId, callback);
			}
		);
	}

}