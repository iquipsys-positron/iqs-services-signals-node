import { ConfigParams } from 'pip-services3-commons-node';

import { SignalsMemoryPersistence } from '../../src/persistence/SignalsMemoryPersistence';
import { SignalsPersistenceFixture } from './SignalsPersistenceFixture';

suite('SignalsMemoryPersistence', ()=> {
    let persistence: SignalsMemoryPersistence;
    let fixture: SignalsPersistenceFixture;
    
    setup((done) => {
        persistence = new SignalsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new SignalsPersistenceFixture(persistence);
        
        persistence.open(null, done);
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