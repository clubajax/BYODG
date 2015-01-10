(function(){

var
    tests = {
        'it emits an event': function (t) {
            var
                h,
                ev = new EventTree();
            h = ev.on('foo', function () {
                t.assert(true);
            });
            ev.emit('foo');
        },
        'it emits an event and passes an argument': function (t) {
            var
                h,
                ev = new EventTree();
            h = ev.on('foo', function (arg) {
                t.assert(arg === 'bar');
            });
            ev.emit('foo', 'bar');
        },
        'it emits an event and passes multiple arguments': function (t) {
            var
                h, array = [1, 2, 3],
                ev = new EventTree();
            h = ev.on('foo', function (a, b, c, d) {
                t.assert(a === 'bar', "a === 'bar'");
                t.assert(b === 99, "b === 99");
                t.assert(c === true, "c === true");
                t.assert(d === array, "d === array");
            });
            ev.emit('foo', 'bar', 99, true, array);

        },
        'it pauses, preventing event emitting': function (t) {
            var
                h, result = true,
                ev = new EventTree();
            h = ev.on('foo', function () {
                result = false;
            });
            h.pause();
            ev.emit('foo');
            t.assert(result, 'should not emit');
        },
        'it should resume emitting events': function (t) {
            var
                h, result = true,
                ev = new EventTree();
            h = ev.on('foo', function () {
                result = false;
            });
            h.pause();
            ev.emit('foo');
            t.assert(result, 'should not emit');
            h.resume();
            ev.emit('foo');
            t.assert(!result, 'it should emit');
        },
        'it should not resume after remove': function (t) {
            var
                h, result = true,
                ev = new EventTree();
            h = ev.on('foo', function () {
                result = false;
            });
            h.remove();
            ev.emit('foo');
            t.assert(result, 'should not emit');
            h.resume();
            ev.emit('foo');
            t.assert(result, 'it should still not emit');
        },
        'it should resume after multiple pauses': function (t) {
            var
                h,
                result = false,
                ev = new EventTree();
            h = ev.on('foo', function () {
                result = true;
            });
            h.pause();
            ev.emit('foo');
            t.assert(!result, 'should not emit');

            h.resume();
            ev.emit('foo');
            t.assert(result, 'should emit');

            result = false;
            h.pause();
            ev.emit('foo');
            t.assert(!result, 'should not emit(2)');

            h.resume();
            ev.emit('foo');
            t.assert(result, 'should emit(2)');

            result = false;
            h.remove();
            ev.emit('foo');
            t.assert(!result, 'should not emit (removed)');
        },
//        'it fails': function(t){
//            t.assert(true === 'FAIL', 'this test fails on purpose');
//        },
        'it should remove all listeners': function (t) {
            var
                h, h2, result = true, result2 = true,
                ev = new EventTree();
            h = ev.on('foo', function () {
                result = false;
            });
            h2 = ev.on('foo', function () {
                result2 = false;
            });

            ev.emit('foo');
            t.assert(result === false && result2 === false, 'it emits...');
            result = true;
            result2 = true;
            ev.removeAll();
            ev.emit('foo');
            t.assert(result && result2, 'it should not emit');
        }
    };

    Object.keys(tests).forEach(function(testName){
        console.log(testName);
        tests[testName](console);
    });
}());