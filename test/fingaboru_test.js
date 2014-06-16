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

  var pageContent = '<div class="page-content">'
  pageContent += '<div data-fingaboru-page="1">Page One</div>'
  pageContent += '<div data-fingaboru-page="2">Page Two</div>'
  pageContent += '<div data-fingaboru-page="3">Page Three</div>'
  pageContent += '</div>'

  var pageContentAlt = '<div class="page-content">'
  pageContentAlt += '<div data-page="1">Page One</div>'
  pageContentAlt += '<div data-page="2">Page Two</div>'
  pageContentAlt += '<div data-page="3">Page Three</div>'
  pageContentAlt += '</div>'


  module('fingaboru plugin')

  test('should be defined on jquery object', function () {
    var div = $('<div></div>')
    ok(div.fingaboru, 'fingaboru method is defined')
  })

  module('fingaboru')

  test('should return element', function () {
    var div = $('<div></div>')
    ok(div.fingaboru() == div, 'document.body returned')
  })

  test('should display the first page as default', function(){
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru()
    ok($el.find('[data-fingaboru-page="1"]').is('.page-active'), 'first page is active')
  })

  test('should start at a specific page if a custom index is defined', function(){
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru({ index: 3 })
    ok($el.find('[data-fingaboru-page="3"]').is('.page-active'), 'first page is active')
  })

  test('should accept a custom page selector', function(){
    var $el = $(pageContentAlt).appendTo('#qunit-fixture').fingaboru({ attr: 'data-page' })
    ok($el.find('[data-page="1"]').is('.page-active'), 'first custom page is active')
  })

  test('should go to a specific page', function(){
    $.support.animation = false
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru()
    $el.fingaboru('goto', { index: 2 })
    ok($el.find('[data-fingaboru-page="1"]').not('.page-active'))
    ok($el.find('[data-fingaboru-page="2"]').is('.page-active'))
    ok($el.find('[data-fingaboru-page="3"]').not('.page-active'))
  })

  test('should go to a specific page #2', function(){
    $.support.animation = false
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru({ index: 3 })
    $el.fingaboru('goto', { index: 1 })
    ok($el.find('[data-fingaboru-page="1"]').is('.page-active'))
    ok($el.find('[data-fingaboru-page="2"]').not('.page-active'))
    ok($el.find('[data-fingaboru-page="3"]').not('.page-active'))
  })

  test('should go to next page', function(){
    $.support.animation = false
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru()
    $el.fingaboru('goto', { index: 'next' })
    ok($el.find('[data-fingaboru-page="1"]').not('.page-active'))
    ok($el.find('[data-fingaboru-page="2"]').is('.page-active'))
    ok($el.find('[data-fingaboru-page="3"]').not('.page-active'))
  })

  test('should go to previous page', function(){
    $.support.animation = false
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru({ index: 2 })
    $el.fingaboru('goto', { index: 'previous' })
    ok($el.find('[data-fingaboru-page="1"]').is('.page-active'))
    ok($el.find('[data-fingaboru-page="2"]').not('.page-active'))
    ok($el.find('[data-fingaboru-page="3"]').not('.page-active'))
  })

  asyncTest('should trigger shown event when page transition is done', function(){
    $.support.animation = false
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru()
    $el.on('shown.fingaboru', function(){
      start()
      ok($el.find('[data-fingaboru-page="2"]').is('.page-active'))
    })
    $el.fingaboru('goto', { index: 2 })
  })

  test('should stay on the same page if page has the same index than previous one', function(){
    var $el = $(pageContent).appendTo('#qunit-fixture').fingaboru({index: 1})
    $el.fingaboru('goto', { index: 1 })
    ok($el.find('[data-fingaboru-page="1"]').is('.page-active'))
  })

  test('should destroy fingaboru', function () {
    var fingaboru = $('<div/>').appendTo('#qunit-fixture').fingaboru()
    ok(fingaboru.data('fingaboru'), 'fingaboru has data')
    fingaboru.fingaboru('destroy')
    ok(!fingaboru.data('fingaboru'), 'fingaboru does not have data')
  })
}(jQuery));
