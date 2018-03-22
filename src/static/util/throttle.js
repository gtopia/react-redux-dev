module.exports = function(opt) {
    var timer = null;
    var t_start;
    var fn = opt.fn;
    var context = opt.context;
    var delay = opt.delay || 300;
    var mustRunDelay = opt.mustRunDelay;

    return function() {
        var args = arguments;
        var t_curr = +new Date();
        context = context || this;

        clearTimeout(timer);
        if (!t_start) {
            t_start = t_curr;
        }

        if (mustRunDelay && t_curr - t_start >= mustRunDelay) {
            fn.apply(context, args);
            t_start = t_curr;
        }
        else {
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        }
    };
};
