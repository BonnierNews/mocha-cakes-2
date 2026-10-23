'use strict';

beforeEachScenario(function () {
  console.log('beforeEachScenario hook');
});

Feature('Multiple exclusives', function () {

  Scenario.only('First exclusive scenario', function () {

    Given('step A', function () {
      (1 + 1).should.equal(2);
    });
  });

  Scenario('Not exclusive', function () {

    Given('step B', function () {
      throw new Error('step B should not run');
    });
  });

  Scenario.only('Second exclusive scenario', function () {

    Given('step C', function () {
      (2 + 2).should.equal(4);
    });
  });

  Scenario('Scenario with exclusive steps', function () {

    Given.only('step D', function () {
      true.should.equal(true);
    });
    And('step E', function () {
      throw new Error('step E should not run');
    });
    Then.only('step F', function () {
      "everything".should.be.ok;
    });
  });
});

Feature('Unrelated feature', function () {

  Scenario('S', function () {

    Given('step G', function () {
      throw new Error('step G should not run');
    });
  });
});
