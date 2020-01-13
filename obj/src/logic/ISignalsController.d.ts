import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SignalV1 } from '../data/version1/SignalV1';
export interface ISignalsController {
    getSignals(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<SignalV1>) => void): void;
    sendSignal(correlationId: string, signal: SignalV1, callback: (err: any, signal: SignalV1) => void): void;
    lockSignal(correlationId: string, signal_id: string, callback: (err: any, result: boolean) => void): void;
    markSignalSent(correlationId: string, signal_id: string, callback: (err: any, result: boolean) => void): void;
    deleteSignalById(correlationId: string, signal_id: string, callback: (err: any, signal: SignalV1) => void): void;
}
