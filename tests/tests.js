/*
 * DECLARATIONS
 */
var failed = false;

function getLastResultAndReset() {
    var result = failed;
    failed = false;
    return result;
}

function expectSuccess() {
    return !getLastResultAndReset();
}

function expectFailure() {
    return getLastResultAndReset();
}

var contextCallbackTest = $.noop, logTest = $.noop;

/*
 * INIT
 */
var options = {
  contextCallback : function(value, message, stacktrace) {
      failed = true;
      return contextCallbackTest(value, message, stacktrace);
  },
  log: function(title, value, message, stacktrace, context) {
      logTest(title, value, message, stacktrace, context);
  },
  catchGlobalErrors : true
};

$.assertSetup(options);

/*
 * TESTS
 */
function runTests() {
    var $root = $("#sandbox");

    module("$.fn.assert");

    test("selection not empty", function() {
        $root.assert();
        ok(expectSuccess());
    });

    test("selection not found", function() {
        $root.children("h6").assert();
        ok(expectFailure());
    });

    test("selection empty", function() {
        $root.children("h6").assert("", 0);
        ok(expectSuccess());
    });

    test("select multiple, then curry", function() {
        $root.children("span").assert("", 3).text("bar");
        ok(expectSuccess());
        $root.children("span").each(function() {
            equals($(this).text(), "bar");
        });
    });

    test("select multiple, count wrong, still curry", function() {
        $root.children("span").assert("", 42).text("foo");
        ok(expectFailure());
        $root.children("span").each(function() {
            equals($(this).text(), "foo");
        });
    });

    test("select multiple, using callback", function() {
        $root.children("span").addClass("baz");
        $root.children("span").assert(function($this) {
            var result = true;
            $.each(this, function() {
                if (!$(this).hasClass("baz")) {
                    result = false;
                }
            })
            return result;
        });
        ok(expectSuccess());
    });

    module("$.assertXXX()");

    test("assert", function() {
        $.assert(true);
        ok(expectSuccess());
        $.assert(false);
        ok(expectFailure());
    });

    test("assertNot", function() {
        $.assertNot(false);
        ok(expectSuccess());
        $.assertNot(true);
        ok(expectFailure());
    });

    test("assertIs", function() {
        $.assertIs(undefined, "undefined");
        ok(expectSuccess());
        $.assertIs(null, "null");
        ok(expectSuccess());
        $.assertIs(0/0, "nan");
        ok(expectSuccess());
        $.assertIs(0, "number");
        ok(expectSuccess());
        $.assertIs("", "string");
        ok(expectSuccess());
        $.assertIs(false, "boolean");
        ok(expectSuccess());
        $.assertIs([], "array");
        ok(expectSuccess());
        $.assertIs(new Date(), "date");
        ok(expectSuccess());
        $.assertIs(/asd/, "regexp");
        ok(expectSuccess());
        $.assertIs(function(){}, "function");
        ok(expectSuccess());
        $.assertIs({}, "object");
        ok(expectSuccess());
    });

    test("assertNotIs", function() {
        $.assertNotIs(undefined, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(null, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(0/0, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(0, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs("", "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(false, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs([], "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(new Date(), "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(/asd/, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs(function(){}, "NO_SUCH_TYPE");
        ok(expectSuccess());
        $.assertNotIs({}, "NO_SUCH_TYPE");
        ok(expectSuccess());
    });

    test("assertEmpty", function() {
        $.assertEmpty(undefined);
        ok(expectSuccess());
        $.assertEmpty(null);
        ok(expectSuccess());
        $.assertEmpty(0/0);
        ok(expectSuccess());
        $.assertEmpty(0);
        ok(expectSuccess());
        $.assertEmpty("");
        ok(expectSuccess());
        $.assertEmpty(false);
        ok(expectSuccess());
        $.assertEmpty([]);
        ok(expectSuccess());
        $.assertEmpty({});
        ok(expectSuccess());

        $.assertEmpty(1);
        ok(expectFailure());
        $.assertEmpty("x");
        ok(expectFailure());
        $.assertEmpty(true);
        ok(expectFailure());
        $.assertEmpty([0]);
        ok(expectFailure());
        $.assertEmpty({a: 1});
        ok(expectFailure());
    });

    test("assertNotEmpty", function() {
        $.assertNotEmpty(undefined);
        ok(expectFailure());
        $.assertNotEmpty(null);
        ok(expectFailure());
        $.assertNotEmpty(0/0);
        ok(expectFailure());
        $.assertNotEmpty(0);
        ok(expectFailure());
        $.assertNotEmpty("");
        ok(expectFailure());
        $.assertNotEmpty(false);
        ok(expectFailure());
        $.assertNotEmpty([]);
        ok(expectFailure());
        $.assertNotEmpty({});
        ok(expectFailure());

        $.assertNotEmpty(1);
        ok(expectSuccess());
        $.assertNotEmpty("x");
        ok(expectSuccess());
        $.assertNotEmpty(true);
        ok(expectSuccess());
        $.assertNotEmpty([0]);
        ok(expectSuccess());
        $.assertNotEmpty({a: 1});
        ok(expectSuccess());
   });

   test("assertSame", function() {
       var a = new Number(5);
       var aa = new Number(5);
       var b = 5;
       $.assertSame(a, a);
       ok(expectSuccess());
       $.assertSame(a, aa);
       ok(expectFailure());
       $.assertSame(a, b);
       ok(expectFailure());

       var n = 0/0;
       $.assertSame(n, n);
       ok(expectFailure());

       $.assertSame(null, null);
       ok(expectSuccess());
       $.assertSame(undefined, undefined);
       ok(expectSuccess());
       $.assertSame("", "");
       ok(expectSuccess());
       $.assertSame(null, undefined);
       ok(expectFailure());
       $.assertSame(false, 0);
       ok(expectFailure());
       $.assertSame({},[]);
       ok(expectFailure());
  });

   test("assertNotSame", function() {
       var a = new Number(5);
       var aa = new Number(5);
       var b = 5;
       $.assertNotSame(a, a);
       ok(expectFailure());
       $.assertNotSame(a, aa);
       ok(expectSuccess());
       $.assertNotSame(a, b);
       ok(expectSuccess());

       var n = 0/0;
       $.assertNotSame(n, n);
       ok(expectSuccess());

       $.assertNotSame(null, null);
       ok(expectFailure());
       $.assertNotSame(undefined, undefined);
       ok(expectFailure());
       $.assertNotSame("", "");
       ok(expectFailure());
       $.assertNotSame(null, undefined);
       ok(expectSuccess());
       $.assertNotSame(false, 0);
       ok(expectSuccess());
       $.assertNotSame({},[]);
       ok(expectSuccess());
  });

  test("assertEquals", function() {
       var a = new Number(5);
       var aa = new Number(5);
       var b = 5;
       $.assertEquals(a, a);
       ok(expectSuccess());
       $.assertEquals(a, aa);
       ok(expectSuccess());
       $.assertEquals(a, b);
       ok(expectSuccess());

       var n = 0/0;
       $.assertEquals(n, n);
       ok(expectSuccess());

       $.assertEquals(null, null);
       ok(expectSuccess());
       $.assertEquals(undefined, undefined);
       ok(expectSuccess());
       $.assertEquals("sdbgjk", "sdbgjk");
       ok(expectSuccess());
       $.assertEquals("", "");
       ok(expectSuccess());
       $.assertEquals(null, undefined);
       ok(expectSuccess());
       $.assertEquals(false, 0);
       ok(expectSuccess());
       $.assertEquals({},{});
       ok(expectFailure());

       var d = new Date();
       var dd = new Date(d);
       $.assertEquals(d, dd);
       ok(expectSuccess());

       var r = /asd/i;
       var rr = new RegExp("asd", "i");
       $.assertEquals(r, rr);
       ok(expectSuccess());
  });

  test("assertNotEquals", function() {
      var a = new Number(5);
      var aa = new Number(5);
      var b = 6;
      $.assertNotEquals(a, a);
      ok(expectFailure());
      $.assertNotEquals(a, aa);
      ok(expectFailure());
      $.assertNotEquals(a, b);
      ok(expectSuccess());

      var n = 0/0;
      $.assertNotEquals(n, n);
      ok(expectFailure());

      $.assertNotEquals(null, null);
      ok(expectFailure());
      $.assertNotEquals(undefined, undefined);
      ok(expectFailure());
      $.assertNotEquals("", "");
      ok(expectFailure());
      $.assertNotEquals("s", "S");
      ok(expectSuccess());
      $.assertNotEquals(null, undefined);
      ok(expectFailure());
      $.assertNotEquals(false, 1);
      ok(expectSuccess());
      $.assertNotEquals({},{});
      ok(expectSuccess());

      var d = new Date();
      var dd = new Date(d+1);
      $.assertNotEquals(d, dd);
      ok(expectSuccess());

      var r = /asd/;
      var rr = new RegExp("asd", "i");
      $.assertNotEquals(r, rr);
      ok(expectSuccess());
  });

  test("assertDeepEquals", function() {
      var f = function() {};
      var a = {
              a: undefined,
              b: null,
              c: NaN,
              d: {
                  e: [false, 1, "2"],
                  f: f
              },
              g: new Date()
      };
      var aa = {
              a: undefined,
              b: null,
              c: NaN,
              d: {
                  e: [false, 1, "2"],
                  f: f
              },
              g: new Date(a.g)
      };

      $.assertDeepEquals(a, a);
      ok(expectSuccess());
      $.assertDeepEquals(a, aa);
      ok(expectSuccess());
      $.assertDeepEquals({}, {});
      ok(expectSuccess());
      $.assertDeepEquals([], []);
      ok(expectSuccess());
      $.assertDeepEquals(1, 1);
      ok(expectSuccess());
  });

  test("assertNotDeepEquals", function() {
      var f = function() {};
      var g = function() {};
      $.assertNotDeepEquals({f: f}, {f: g});
      ok(expectSuccess());
      $.assertNotDeepEquals({f: f}, {g: f});
      ok(expectSuccess());
      $.assertNotDeepEquals({f: new Date()}, {f: new Date(0)});
      ok(expectSuccess());
      $.assertNotDeepEquals({n: NaN}, {n: null});
      ok(expectSuccess());
      $.assertNotDeepEquals({n: NaN}, {n: NaN});
      ok(expectFailure());
  });

  module("options");

  test("contextCallback, log", function() {
      var o = {}, msg = "Fffffffffff", ctx = "Wwwwwwwwwwwwwww", tilt = "TEST";
      $.assertSetup({title: tilt});
      contextCallbackTest = function(value, message, stacktrace) {
          strictEqual(value, o);
          strictEqual(message, msg);
          ok(stacktrace);
          return ctx;
      }
      logTest = function(title, value, message, stacktrace, context) {
          strictEqual(title,tilt);
          strictEqual(value, o);
          strictEqual(message, msg);
          ok(stacktrace);
          strictEqual(context, ctx);
      }
      $.assertNot(o, msg)
      contextCallbackTest = $.noop, logTest = $.noop;
  });

  asyncTest("catchGlobalErrors", function() {
      setTimeout(function(){
          setTimeout(function(){
              start();
              ok(expectFailure());
          })
          var foo;
          foo.bar = 123;
      });
  });

  asyncTest("ajax", 1, function() {
      $.assertSetup("/logger");
      $.ajax({
          beforeSend: function(jqXHR, settings) {
              start();
              ok(true);
              return false;
          }
      })
      $.assert(false);
      $.assertSetup({ajax: null});
  });

}
