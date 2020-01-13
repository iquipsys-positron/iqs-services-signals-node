let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { SignalV1 } from '../data/version1/SignalV1';
import { ISignalsPersistence } from './ISignalsPersistence';

export class SignalsMemoryPersistence 
    extends IdentifiableMemoryPersistence<SignalV1, string> 
    implements ISignalsPersistence {

    constructor() {
        super();
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        // Todo: Convert to UTC time?
        let now = new Date().getTime();
        
        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let orgId = filter.getAsNullableString('org_id');
        let deviceId = filter.getAsNullableString('device_id');
        let sent = filter.getAsNullableBoolean('sent');
        let locked = filter.getAsNullableBoolean('locked');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (type && item.type != type) 
                return false;
            if (orgId && item.org_id != orgId) 
                return false;
            if (deviceId && item.device_id != deviceId) 
                return false;
            if (fromTime && item.time < fromTime) 
                return false;
            if (toTime && item.time >= toTime) 
                return false;
            if (sent != null && (item.sent || false) != sent) 
                return false;
            if (locked != null && (item.lock_until > now) != locked) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<SignalV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public lock(correlationId: string, id: string, duration: number,
        callback: (err: any, result: boolean) => void): void {
        let index = this._items.map((x) => { return x.id; }).indexOf(id);

        if (index < 0) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, false);
            return;
        }

        let item: any = this._items[index];
        let now = new Date().getTime();

        if (item.lock_until > now) {
            this._logger.trace(correlationId, "Item %s was already locked", id);
            callback(null, false);
            return;
        }

        if (item.sent) {
            this._logger.trace(correlationId, "Item %s was processed", id);
            callback(null, false);
            return;
        }

        item.lock_until = now + duration;
        this._items[index] = item;
        this._logger.trace(correlationId, "Locked item %s", id);

        this.save(correlationId, (err) => {
            if (callback) callback(err, true)
        });
    }
    
}
