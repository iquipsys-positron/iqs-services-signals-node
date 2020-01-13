import { ConfigParams } from 'pip-services3-commons-node';

import { SignalsFilePersistence } from '../../src/persistence/SignalsFilePersistence';
import { SignalsPersistenceFixture } from './SignalsPersistenceFixture';

suite('SignalsFilePersistence', ()=> {
    let persistence: SignalsFilePersistence;
    let fixture: SignalsPersistenceFixture;
    
    setup((done) => {
        persistence = new SignalsFilePersistence('./data/signals.test.json');

        fixture = new SignalsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Lock', (done) => {
        fixture.testLock(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});