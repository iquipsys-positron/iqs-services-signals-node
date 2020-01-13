let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { SignalV1 } from '../../../src/data/version1/SignalV1';
import { SignalsMemoryPersistence } from '../../../src/persistence/SignalsMemoryPersistence';
import { SignalsController } from '../../../src/logic/SignalsController';
import { SignalsHttpServiceV1 } from '../../../src/services/version1/SignalsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('SignalsHttpServiceV1', ()=> {    
    let service: SignalsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new SignalsMemoryPersistence();
        let controller = new SignalsController();

        service = new SignalsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-signals', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-signals', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-signals', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let signal1, signal2;

        async.series([
        // Create one signal
            (callback) => {
                rest.post('/v1/signals/send_signal',
                    {
                        signal: SIGNAL1
                    },
                    (err, req, res, signal) => {
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
                rest.post('/v1/signals/send_signal', 
                    {
                        signal: SIGNAL2
                    },
                    (err, req, res, signal) => {
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
                rest.post('/v1/signals/get_signals',
                    {},
                    (err, req, res, page) => {
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