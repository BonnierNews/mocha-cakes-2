'use strict';

beforeEachScenario(function () {
  console.log('beforeEachScenario hook');
});

Feature.skip('Skipped feature', function () {

  before(function () {
    console.log('before hook in skipped feature');
  });

  Scenario('Nested scenario', function () {

    Given('nested step', function () {
      throw new Error('nested step should not run');
    });
    Then('another nested step', function () {
      throw new Error('another nested step should not run');
    });
  });
});

Feature('Active feature', function () {

  Scenario('Active scenario', function () {

    Given('active step', function () {
      true.should.equal(true);
    });
  });
});
