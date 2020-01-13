import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { SignalV1 } from '../data/version1/SignalV1';
import { ISignalsPersistence } from './ISignalsPersistence';
export declare class SignalsMemoryPersistence extends IdentifiableMemoryPersistence<SignalV1, string> implements ISignalsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<SignalV1>) => void): void;
    lock(correlationId: string, id: string, duration: number, callback: (err: any, result: boolean) => void): void;
}
