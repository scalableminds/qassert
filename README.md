[QAssert] A JavaScript Assertion Framework with AJAX reporting.
===============================================================

QUnit is a powerful, easy-to-use, JavaScript assertion suite.
It can be used in both in unit, functional and manual tests, and notably also
in production code. Its main feature is to report assertion failures via
a configurable AJAX call. I.e. failed assertion can be tracked independently
from the environment.

QAssert is especially useful for regression testing: You can place assertions
for any assumption that is made in the JavaScript logic. While running the code
assertion violations will be reported via AJAX and regressions become quickly
visible. To give you an example how to safeguard against unexpected DOM changes:

var $panel = $("#menuPanel");

$panel.assert().load("/");

$.assert($panel.text().length);

See doc/index.html for details!

If you are interested in helping developing QAssert, you are in the right place.
For related discussions, visit the
[QAssert on GitHub](https://github.com/gaboom/qassert).
