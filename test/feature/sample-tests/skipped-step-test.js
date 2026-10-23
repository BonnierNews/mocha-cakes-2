'use strict';

Feature('Mocha Cakes', function () {

  Scenario('Scenario with a skipped step', function () {

    Given('an active step', function () {
      true.should.equal(true);
    });
    But.skip('a skipped step', function () {
      throw new Error('a skipped step should not run');
    });
  });
});
