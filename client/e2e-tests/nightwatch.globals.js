// Not used resources are commented
let nightwatchSettings = {
  // this controls whether to abort the test execution when an assertion failed and skip the rest
  // it's being used in waitFor commands and expect assertions
  abortOnAssertionFailure: true,
  // this will overwrite the default polling interval (currently 500ms) for waitFor commands
  // and expect assertions that use retry
  waitForConditionPollInterval: 300,
  // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
  // expect assertions
  waitForConditionTimeout: 25000,
  // this will cause waitFor commands on elements to throw an error if multiple
  // elements are found using the given locate strategy and selector
  throwOnMultipleElementsReturned: true,
  // controls the timeout time for async hooks. Expects the done() callback to be invoked within this time
  // or an error is thrown
  asyncHookTimeout: 10000,
  // Executed before and after executing ALL test files
  before: function(done) {
    // console.log("GLOBAL before");
    done();
  },
  after: function(done) {
    // console.log("GLOBAL after");
    done();
  },
  // Executed before and after executing a test file
  beforeEach: function(done) {
    // console.log("GLOBAL beforeEach");
    done();
  },
  afterEach: function(done) {
    // console.log("GLOBAL afterEach");
    done();
  }
};

module.exports = Object.assign({}, nightwatchSettings);
