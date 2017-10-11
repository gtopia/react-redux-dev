var ua = navigator.userAgent.toLowerCase();
var external = window.external || '';
var core, m, extra, version, os;

var numberify = function(s) {
    var c = 0;
    try {
        c = parseFloat(s.replace(/\./g, function() {
            return (c++ === 1) ? '' : '.';
        }));
    } catch (e) {}
    return c;
};

try {
    if ((/windows|win32/i).test(ua)) {
        os = 'windows';
    } else if ((/macintosh/i).test(ua)) {
        os = 'macintosh';
    } else if ((/rhino/i).test(ua)) {
        os = 'rhino';
    } else if ((/like mac os x/i).test(ua)) {
        os = 'ios';
    } else if ((/android/).test(ua)) {
        os = 'android';
    }

    if ((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]) {
        core = 'webkit';
        version = numberify(m[1]);
    } else if ((m = ua.match(/presto\/([\d.]*)/)) && m[1]) {
        core = 'presto';
        version = numberify(m[1]);
    } else if (m = ua.match(/msie\s([^;]*)/)) {
        core = 'trident';
        version = 1.0;
        if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
            version = numberify(m[1]);
        }
    } else if (/gecko/.test(ua)) {
        core = 'gecko';
        version = 1.0;
        if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
            version = numberify(m[1]);
        }
    }

    if (/world/.test(ua)) {
        extra = 'world';
    } else if (/360se/.test(ua)) {
        extra = '360';
    } else if ((/maxthon/.test(ua)) || typeof external.max_version == 'number') {
        extra = 'maxthon';
    } else if (/tencenttraveler\s([\d.]*)/.test(ua)) {
        extra = 'tt';
    } else if (/se\s([\d.]*)/.test(ua)) {
        extra = 'sogou';
    }
} catch (e) {}

var Browser = {
    'UA': ua,
    'OS': os,
    'CORE': core,
    'Version': version,
    'EXTRA': (extra ? extra : false),
    'IE': /msie/.test(ua),
    'OPERA': /opera/.test(ua),
    'MOZ': /gecko/.test(ua) && !/(compatible|webkit)/.test(ua),
    'IE5': /msie 5 /.test(ua),
    'IE55': /msie 5.5/.test(ua),
    'IE6': /msie 6/.test(ua),
    'IE7': /msie 7/.test(ua),
    'IE8': /msie 8/.test(ua),
    'IE9': /msie 9/.test(ua),
    'IE10': /msie 10/.test(ua),
    'CHROME': /(chrome|crios)\/([\d.]*)/.test(ua),
    'IPAD': /\(ipad/i.test(ua),
    'IPHONE': /\(iphone/i.test(ua),
    'ITOUCH': /\((itouch|ipod)/i.test(ua),
    'MOBILE': /mobile/i.test(ua),
    'WX': /MicroMessenger/i.test(ua),
    'UC': /UCBrowser/i.test(ua),
    'QQ': /QQBrowser/i.test(ua),
    'WB':/Weibo/i.test(ua),
    'SINANEWS':/sinanews/i.test(ua),    // 新浪新闻客户端
};

Browser.SAFARI = !Browser.UC && !Browser.CHROME && (/([\w.]*) safari/).test(ua);

module.exports = Browser;
