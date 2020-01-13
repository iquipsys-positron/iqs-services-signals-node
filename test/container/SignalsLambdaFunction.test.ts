let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { SignalV1 } from '../../src/data/version1/SignalV1';
import { SignalsMemoryPersistence } from '../../src/persistence/SignalsMemoryPersistence';
import { SignalsController } from '../../src/logic/SignalsController';
import { SignalsLambdaFunction } from '../../src/container/SignalsLambdaFunction';

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

suite('SignalsLambdaFunction', ()=> {
    let lambda: SignalsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-signals:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-signals:controller:default:default:1.0'
        );

        lambda = new SignalsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var signal1, signal2: SignalV1;

        async.series([
        // Create one signal
            (callback) => {
                lambda.act(
                    {
                        role: 'signals',
                        cmd: 'send_signal',
                        signal: SIGNAL1
                    },
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.equal(signal.org_id, SIGNAL1.org_id);
                        assert.equal(signal.type, SIGNAL1.type);
                        assert.equal(signal.device_id, SIGNAL1.device_id);

                        signal1 = signal;

                        callback();
                    }
                );
            },
        // Create another signal
            (callback) => {
                lambda.act(
                    {
                        role: 'signals',
                        cmd: 'send_signal',
                        signal: SIGNAL2
                    },
                    (err, signal) => {
                        assert.isNull(err);

                        assert.isObject(signal);
                        assert.equal(signal.org_id, SIGNAL2.org_id);
                        assert.equal(signal.type, SIGNAL2.type);
                        assert.equal(signal.device_id, SIGNAL2.device_id);

                        signal2 = signal;

                        callback();
                    }
                );
            },
        // Get all signals
            (callback) => {
                lambda.act(
                    {
                        role: 'signals',
                        cmd: 'get_signals' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            }
        ], done);
    });
});