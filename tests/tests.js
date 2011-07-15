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


/*
 * INIT
 */
var options = {
  contextCallback : function(value, message, stacktrace) {
      failed = true;
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
}
