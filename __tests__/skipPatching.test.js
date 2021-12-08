const handler = require('../jest/mockfunction/handler.skip');


const enabled = require('../lib/enabled.json')
const disabled = require('../lib/disabled.json')

test('Print out Responses from the Lambda for an enabled skip patching', () => {
    response = handler.skip(enabled)
});

test('Print out Responses from the Lambda for a disabled skip patching', () => {
    response = handler.skip(disabled)
});