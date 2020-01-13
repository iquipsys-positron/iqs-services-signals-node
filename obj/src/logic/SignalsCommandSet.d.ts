import { CommandSet } from 'pip-services3-commons-node';
import { ISignalsController } from './ISignalsController';
export declare class SignalsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ISignalsController);
    private makeGetSignalsCommand;
    private makeSendSignalCommand;
    private makeLockSignalCommand;
    private makeMarkSignalSentCommand;
    private makeDeleteSignalByIdCommand;
}
