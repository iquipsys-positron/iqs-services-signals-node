import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { SignalV1 } from '../data/version1/SignalV1';
export interface ISignalsPersistence extends IGetter<SignalV1, string>, IWriter<SignalV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<SignalV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: SignalV1) => void): void;
    create(correlationId: string, item: SignalV1, callback: (err: any, item: SignalV1) => void): void;
    lock(correlationId: string, id: string, duration: number, callback: (err: any, result: boolean) => void): void;
    updatePartially(correlationId: string, id: string, data: AnyValueMap, callback: (err: any, item: SignalV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: SignalV1) => void): void;
}
