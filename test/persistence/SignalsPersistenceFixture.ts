let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';

import { SignalV1 } from '../../src/data/version1/SignalV1';

import { ISignalsPersistence } from '../../src/persistence/ISignalsPersistence';

let SIGNAL1: SignalV1 = {
    id: '1',
    org_id: '1',
    time: new Date(),
    device_id: '1',
    type: 1
};
let SIGNAL2: SignalV1 = {
    id: '2',
    org_id: '1',
    time: new Date(),
    device_id: '1',
    type: 2,
    lock_until: new Date().getTime() + 10000
};
let SIGNAL3: SignalV1 = {
    id: '3',
    org_id: '2',
    time: new Date(),
    device_id: '2',
    type: 4,
    sent: true
};

export class SignalsPersistenceFixture {
    private _persistence: ISignalsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateSignals(done) {
        async.series([
        // Create one signal
            (callback) => {
                this._persistence.create(
                    null,
                    SIGNAL1,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.equal(signal.org_id, SIGNAL1.org_id);
                        assert.equal(signal.type, SIGNAL1.type);
                        assert.equal(signal.device_id, SIGNAL1.device_id);

                        callback();
                    }
                );
            },
        // Create another signal
            (callback) => {
                this._persistence.create(
                    null,
                    SIGNAL2,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.equal(signal.org_id, SIGNAL2.org_id);
                        assert.equal(signal.type, SIGNAL2.type);
                        assert.equal(signal.device_id, SIGNAL2.device_id);

                        callback();
                    }
                );
            },
        // Create yet another signal
            (callback) => {
                this._persistence.create(
                    null,
                    SIGNAL3,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.equal(signal.org_id, SIGNAL3.org_id);
                        assert.equal(signal.type, SIGNAL3.type);
                        assert.equal(signal.device_id, SIGNAL3.device_id);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let signal1: SignalV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateSignals(callback);
            },
        // Get all signals
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        signal1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the signal
            (callback) => {
                let data = AnyValueMap.fromTuples(
                    'lock_until', null,
                    'sent', true
                );

                this._persistence.updatePartially(
                    null,
                    signal1.id,
                    data,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.isTrue(signal.sent);
                        assert.equal(signal.id, signal1.id);

                        callback();
                    }
                );
            },
        // Delete signal
            (callback) => {
                this._persistence.deleteById(
                    null,
                    signal1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete signal
            (callback) => {
                this._persistence.getOneById(
                    null,
                    signal1.id,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isNull(signal || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testLock(done) {
        async.series([
        // Create items
            (callback) => {
                this.testCreateSignals(callback);
            },
        // Lock unlocked item
            (callback) => {
                this._persistence.lock(
                    null,
                    SIGNAL1.id,
                    10000,
                    (err, result) => {
                        assert.isNull(err);

                        assert.isTrue(result);

                        callback();
                    }
                );
            },
        // Lock already llocked item
            (callback) => {
                this._persistence.lock(
                    null,
                    SIGNAL1.id,
                    10000,
                    (err, result) => {
                        assert.isNull(err);

                        assert.isFalse(result);

                        callback();
                    }
                );
            },
        // Try to get delete signal
            (callback) => {
                this._persistence.getOneById(
                    null,
                    SIGNAL1.id,
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.isTrue(signal.lock_until > 0);

                        callback();
                    }
                );
            }
        ], done);
    }
    
    public testGetWithFilter(done) {
        async.series([
        // Create signals
            (callback) => {
                this.testCreateSignals(callback);
            },
        // Get signals filtered by org_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, signals) => {
                        assert.isNull(err);

                        assert.isObject(signals);
                        assert.lengthOf(signals.data, 2);

                        callback();
                    }
                );
            },
        // Get signals by type
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        device_id: '1'
                    }),
                    new PagingParams(),
                    (err, signals) => {
                        assert.isNull(err);

                        assert.isObject(signals);
                        assert.lengthOf(signals.data, 2);

                        callback();
                    }
                );
            },
            // Get signals filtered by sent
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        sent: false
                    }),
                    new PagingParams(),
                    (err, signals) => {
                        assert.isNull(err);

                        assert.isObject(signals);
                        assert.lengthOf(signals.data, 2);

                        callback();
                    }
                );
            },
        // Get signals filtered by sent
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        locked: false
                    }),
                    new PagingParams(),
                    (err, signals) => {
                        assert.isNull(err);

                        assert.isObject(signals);
                        assert.lengthOf(signals.data, 2);

                        callback();
                    }
                );
            },
        // Get signals filtered by severity
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        from_time: SIGNAL1.time,
                        to_time: new Date(SIGNAL3.time.getTime() + 100)
                    }),
                    new PagingParams(),
                    (err, signals) => {
                        assert.isNull(err);

                        assert.isObject(signals);
                        assert.lengthOf(signals.data, 3);

                        callback();
                    }
                );
            }
        ], done);
    }

}
