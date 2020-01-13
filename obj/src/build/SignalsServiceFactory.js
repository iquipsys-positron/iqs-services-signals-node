"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const SignalsMongoDbPersistence_1 = require("../persistence/SignalsMongoDbPersistence");
const SignalsFilePersistence_1 = require("../persistence/SignalsFilePersistence");
const SignalsMemoryPersistence_1 = require("../persistence/SignalsMemoryPersistence");
const SignalsController_1 = require("../logic/SignalsController");
const SignalsHttpServiceV1_1 = require("../services/version1/SignalsHttpServiceV1");
class SignalsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(SignalsServiceFactory.MemoryPersistenceDescriptor, SignalsMemoryPersistence_1.SignalsMemoryPersistence);
        this.registerAsType(SignalsServiceFactory.FilePersistenceDescriptor, SignalsFilePersistence_1.SignalsFilePersistence);
        this.registerAsType(SignalsServiceFactory.MongoDbPersistenceDescriptor, SignalsMongoDbPersistence_1.SignalsMongoDbPersistence);
        this.registerAsType(SignalsServiceFactory.ControllerDescriptor, SignalsController_1.SignalsController);
        this.registerAsType(SignalsServiceFactory.HttpServiceDescriptor, SignalsHttpServiceV1_1.SignalsHttpServiceV1);
    }
}
exports.SignalsServiceFactory = SignalsServiceFactory;
SignalsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "factory", "default", "default", "1.0");
SignalsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "persistence", "memory", "*", "1.0");
SignalsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "persistence", "file", "*", "1.0");
SignalsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "persistence", "mongodb", "*", "1.0");
SignalsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "controller", "default", "*", "1.0");
SignalsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-signals", "service", "http", "*", "1.0");
//# sourceMappingURL=SignalsServiceFactory.js.map