let SignalsProcess = require('../obj/src/container/SignalsProcess').SignalsProcess;

try {
    new SignalsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
