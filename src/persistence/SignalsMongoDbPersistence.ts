let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { SignalV1 } from '../data/version1/SignalV1';
import { ISignalsPersistence } from './ISignalsPersistence';

export class SignalsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<SignalV1, string>
    implements ISignalsPersistence {

    constructor() {
        super('signals');
        super.ensureIndex({ org_id: 1, time: -1, device_id: 1 });
        this._maxPageSize = 1000;
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });

        let deviceId = filter.getAsNullableString('device_id');
        if (deviceId != null)
            criteria.push({ device_id: deviceId });

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });

        let sent = filter.getAsNullableBoolean('sent');
        if (sent != null) {
            if (sent)
                criteria.push({ sent: true });
            else
                criteria.push({ $or: [ { sent: false }, { sent: { $exists: false } } ] });
        }

        let locked = filter.getAsNullableBoolean('locked');
        if (locked != null) {
            let now = new Date().getTime();
            if (locked)
                criteria.push({ lock_until: { $gt: now }  });
            else
                criteria.push({ $or: [ { lock_until: { $lte: now } }, { lock_until: { $exists: false } } ] });
        }
        
        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<SignalV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public lock(correlationId: string, id: string, duration: number,
        callback: (err: any, result: boolean) => void): void {
        
        let now = new Date().getTime();
        let filter = {
            _id: id,
            $or: [
                { lock_until: { $lte: now } }, 
                { lock_until: { $exists: false } }
            ]
        };
        let data = {
            $set: {
                lock_until: now + duration
            }
        }

        this._collection.updateMany(filter, data, (err, result) => {
            let count: number = result ? result.modifiedCount : null;
            if (!err && count > 0)
                this._logger.trace(correlationId, "Locked item %s from %s", id, this._collectionName);

            if (callback) callback(err, count > 0);
        });
    }


}
