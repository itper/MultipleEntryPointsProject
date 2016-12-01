import Uuid from './uuid.js';
import Cookie from './cookie.js';
import Storage from './storage.js';
var GJLOG_INSTANCE = null;
function GJLog(config){
    // if(GJLOG_INSTANCE)return GJLOG_INSTANCE;
    GJLOG_INSTANCE = this;
    this.userInfo = {};
    this.storage = new Storage('GANJI_UUID');

    try {
        this.userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
    } catch (ex) {
        this.userInfo = {};
    }

    this. urlParams = this.parseQueryString(window.location.search);
    this. server   = 'analytics.ganji.com';
    this. gjch     = config.gjch || '-';
    this. gc       = config.gc || '-';
    this. gjchver =  config.gjchver || 'A';
    this. guid     = Cookie.get('__utmganji_v20110909') || this.storage.get('__utmganji_v20110909') || this.getUuid() || '-';
    this. sid      = Cookie.get('GANJISESSID') || '-';

    this. ifid     = Cookie.get('ifid') || this.getIfid() || '-';
    this. caInfo   = config.cainfo || this.getCaInfo() || Cookie.get('cainfo') || {};
    this. userId   = this.userInfo.user_id;
    this. ua       = this.getUaInfo();
    this. refer    = document.referrer ? encodeURIComponent(document.referrer) : '-';
    this. caName   = encodeURIComponent(this.caInfo.ca_name || '-');
    this. caSource = encodeURIComponent(this.caInfo.ca_source || '-');
    this. caKw     = encodeURIComponent(this.caInfo.ca_kw || '-');
    this. caId     = encodeURIComponent(this.caInfo.ca_id || '-');
    this. caN     = encodeURIComponent(this.caInfo.ca_n || '-');
    this. caS     = encodeURIComponent(this.caInfo.ca_s || '-');
    this. caI     = encodeURIComponent(this.caInfo.ca_i || '-');
    this. showLogCache = {};
}
GJLog.prototype.getUuid = function () {
    var uuid = Uuid.generateUUIDV4();
    if (uuid) {

        Cookie.set('__utmganji_v20110909', uuid, {
            expires: 2*365*8640,
            path: '/',
            domain: '.ganji.com'
        });
    }
    //set localstorage
    this.storage.set('__utmganji_v20110909', uuid);
    return uuid;
}

GJLog.prototype.getUaInfo = function () {
    var ua = window.navigator.userAgent || '';
    var match = ua.match(/Mozilla\/5.0 \((.*)\) AppleWebKit(.*?) .*like Gecko\)([\S]*) (.*) Safari.*/);
    var device, os;

    if (!match || !match[1]) {
        return 'UNKNOW ' + ua;
    }
    try {
        if (/like Mac OS X/.test(match[1])) {
            os = 'iOS ' + ((match[1].match(/([\d_]*)* like Mac OS X/) || [])[1] || '');
        } else if (/Android/.test(match[1])) {
            os = (match[1].match(/Android.*?;/) || [])[0];
        } else {
            os = 'unknow';
        }

        device = (match[1].match(/^(iPad[^;]*|iPhone[^;]*|iPod[^;]*)/) || match[1].match('.*;(.*)') || [])[1];
        device = device ? device.trim() : '';

        ua = [
            'device:' + device,
            'os:' + os,
            'webkit:' + (match[2] || '').replace('/', ''),
            'browser:' + match[4],
            'lang:' + (window.navigator.language || window.navigator.browserLanguage)
        ].join('|');
        return ua;
    } catch (ex) {
        return 'UNKNOW ' + ua;
    }
}
GJLog.prototype.getIfid = function () {
    return this.urlParams.ifid;
}

GJLog.prototype. getCaInfo = function () {
    //url parse
    var ca_source = this.urlParams.ca_source;
    var ca_name = this.urlParams.ca_name;
    var cainfo;
    if(ca_source && ca_name){
    //setcookie
        cainfo = {
            ca_source: ca_source,
            ca_name: ca_name
        };

        Cookie.set('cainfo', JSON.stringify(cainfo), {
            path:'/',
            domain: '.ganji.com'
        });
    }
    return cainfo;
}

GJLog.prototype.parseQueryString = function (query) {
    return query.replace(/^\?/, '')
            .split('&')
            .map(function (pair) {
                return pair.split('=');
            })
            .reduce(function (obj, pair) {
                if (pair[0].trim()) {
                    obj[pair[0]] = pair[1];
                }

                return obj;
            }, {});
}

GJLog.prototype.getUaInfo = function () {
    var ua = window.navigator.userAgent || '';
    var match = ua.match(/Mozilla\/5.0 \((.*)\) AppleWebKit(.*?) .*like Gecko\)([\S]*) (.*) Safari.*/);
    var device, os;

    if (!match || !match[1]) {
        return 'UNKNOW ' + ua;
    }
    try {
        if (/like Mac OS X/.test(match[1])) {
            os = 'iOS ' + ((match[1].match(/([\d_]*)* like Mac OS X/) || [])[1] || '');
        } else if (/Android/.test(match[1])) {
            os = (match[1].match(/Android.*?;/) || [])[0];
        } else {
            os = 'unknow';
        }

        device = (match[1].match(/^(iPad[^;]*|iPhone[^;]*|iPod[^;]*)/) || match[1].match('.*;(.*)') || [])[1];
        device = device ? device.trim() : '';

        ua = [
            'device:' + device,
            'os:' + os,
            'webkit:' + (match[2] || '').replace('/', ''),
            'browser:' + match[4],
            'lang:' + (window.navigator.language || window.navigator.browserLanguage)
        ].join('|');
        return ua;
    } catch (ex) {
        return 'UNKNOW ' + ua;
    }
}
GJLog.prototype.trigger = function (gjalog) {
        // var gjalog = $(e.currentTarget).attr('data-gjalog') || '';
        var match;
        if ((match = /^(\d*)$/.exec(gjalog.split('@')[0])) && match[1].substr(-2)[0] === '1') {
            this.send(gjalog.replace(/\d{8}($|@)/, '00000010$1'));
        } else if (gjalog.indexOf('atype=click') !== -1) {
            this.send(gjalog);
        }
};

GJLog.prototype.send = function (gjalog, cb) {


    this.sendlog(gjalog,'wape.gif',cb);

    // return 以下是旧逻辑，已经整合进sendlog代码里面
    return;
};



// 发送pv统计，传入gjch
GJLog.prototype.sendPv = function(gjchnew)
{
    if(gjchnew)
    {
        this.gjch = gjchnew;
    }
    this.sendlog(null,'h5p.gif');
};

// 用于widget发送Pv
GJLog.prototype.widgetSendPv = function (config) {

    if(config.gjch)
    {
        this.gjch = config.gjch;
    }
    this.sendlog(null,'h5p.gif');

};



// send底层方法
// log :ge or gjalog
// logUrl : 统计gif
// cb : callback回调
GJLog.prototype.sendlog = function(log,logUrl,cb)
{
    var img = new Image();
    var done = false;
    var url =   '//' + logUrl.indexOf('//')===0?logUrl:this.server + '/' + logUrl + '?';
    if(logUrl.indexOf('http')===0 || logUrl.indexOf('//')===0){
        url = logUrl;
    }


    if(!log)
    {
        log = '';
    }
    else {
        if (log && /^\d*$/.test(log.split('@')[0])) {
            log = 'ge=' + log;
        } else {
            log = 'gjalog=' + log;
        }
    }

    var staparam = [
        'gjchver=' + this.gjchver,
        'gjch=' + this.gjch,
        'gc=' + this.gc,
        'uuid=' + this.guid,
        'gjuser=' + this.userId,
        'sid=' + this.sid,
        'ca_name=' + this.caName,
        'ca_source=' + this.caSource,
        'ca_kw=' + this.caKw,
        'ca_id=' + this.caId,
        'ca_n=' + this.caN,
        'ca_s=' + this.caS,
        'ca_i=' + this.caI,
        'refer=' + this.refer,
        'ua=' + this.ua,
        'ifid=' + this.ifid,
        'rnd=' + Math.random()
    ];

    if(log !== '')
    {
        staparam.push(log);
    }

    url += staparam.join('&');

    function callback (err) {
        if (done) {
            return;
        }

        done = true;
        if (cb) {
            cb(err || null);
        }
    }

    img.onload = function () {
        callback();
    };

    img.onerror = function () {
        callback(new Error('network error'));
    };

    setTimeout(function () {
        callback(new Error('timeout'));
    }, 10000);

    img.src = url;
}
export default GJLog;