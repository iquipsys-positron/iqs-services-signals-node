import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { SignalV1 } from '../data/version1/SignalV1';
import { ISignalsController } from './ISignalsController';
export declare class SignalsController implements IConfigurable, IReferenceable, ICommandable, ISignalsController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    private _lockDuration;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getSignals(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<SignalV1>) => void): void;
    sendSignal(correlationId: string, signal: SignalV1, callback: (err: any, signal: SignalV1) => void): void;
    lockSignal(correlationId: string, signal_id: string, callback: (err: any, result: boolean) => void): void;
    markSignalSent(correlationId: string, signal_id: string, callback: (err: any, result: boolean) => void): void;
    deleteSignalById(correlationId: string, id: string, callback: (err: any, signal: SignalV1) => void): void;
}
