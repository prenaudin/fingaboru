(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('fingaboru')

  test('should destroy fingaboru', function () {
    var fingaboru = $('<div/>').fingaboru()
    ok(fingaboru.data('fingaboru'), 'fingaboru has data')
    fingaboru.fingaboru('destroy')
    ok(!fingaboru.data('fingaboru'), 'fingaboru does not have data')
  })
}(jQuery));
