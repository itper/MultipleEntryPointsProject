var NativeAPI = require('./NativeApi');
var isWeixin;
var GoGanjiApp = {
    params: {},
    conf: {
        timeout: 1001,
        url: 'http://sta.ganji.com/att/project/touch/download_app/index.html?',
        paramUrl: 'ganji://3g.ganji.com/protocol1/?data={}',
        other_url: 'https://applesite.ganji.com/'
    },
    timeload: null,
    wxShowMask:false,//true:微信下展示引导层 ， false微信下不展示引导层
    init: function (opt,setHrefCallback,loadFrameCallback) {
        this.setHrefCallback = setHrefCallback;
        this.loadFrameCallback = loadFrameCallback;
        if(isWeixin&&this.wxShowMask){
            return false;
        }
        //title, url, open_mode, is_login, arg，root_url,other_url
        var _self = this;
        var paramUrl = opt.paramUrl || this.conf.paramUrl;
        var root_url = opt.root_url || this.conf.url;
        this.params = opt;
        (function (window) {
            window.onblur = function () {
                window.clearTimeout(_self.timeload);
                _self.timeload = null;
            };
        })(window);
        var wapdata = {
            root_url: root_url,
            arg: opt.arg,
            schemaParm: paramUrl.split('data=')[0],
            other_url: opt.other_url || this.conf.other_url
        };
        //ios9 及以上
        var ua = navigator.userAgent.toLowerCase();
        if (!NativeAPI.isSupport() && /os (9|1\d)_/.test(ua) && !!wapdata.other_url && wapdata.other_url.indexOf('http') > -1) {

            /*if (!NativeAPI.isSupport() && /os (9|1\d)_/.test(ua) && !!wapdata.other_url && wapdata.other_url.indexOf('http') > -1 && tag === 'a' && ua.search(/micromessenger/) === -1) {//去掉判断微信的部分*/
            //ios9及以上
            // fromurl会有可能会包含data=，所以不能直接用paramUrl.split('data=')[1]来截取json字符串，会被截断
            var indexData = paramUrl.indexOf('data=');//字符串的startPos
            var data = paramUrl.substring(indexData + 'data='.length);
            var dataObj = window.JSON.parse(data);
            data = {...dataObj,...wapdata};
            if(!data.cParam)
            {
                data = {...data,...{
                    'cParam': {
                        'fromurl': window.location.href,
                        'from': 'wap',
                        'fromposition':'wap'
                    }
                }};
            }
            else
            {
                if(!data.cParam.fromposition)
                {
                    data.cParam.fromposition = 'wap';
                }
            }

            if(isWeixin){
                data.cParam.from='weixin';
            }
            var drop_url = wapdata.other_url + '?data=' + window.encodeURIComponent(window.JSON.stringify(data));
            // this.curDom.href = drop_url;
            // $(this.curDom).unbind('click');
            setHrefCallback(drop_url);
        }
    },
    install: function () {

        var opt = this.params;
        var _self = this;
        if (!NativeAPI.isSupport()) {
            var args, time, root_url, paramUrl, appUrl,
                ua = navigator.userAgent.toLowerCase();
            time = Date.now();
            args = opt.arg;
            root_url = opt.root_url || this.conf.url;
            paramUrl = opt.paramUrl || this.conf.paramUrl;
            console.log(paramUrl);
            var wapdata = {
                root_url: root_url,
                arg: opt.arg,
                schemaParm: paramUrl.split('data=')[0],
                other_url: opt.other_url || this.conf.other_url
            };
            // fromurl会有可能会包含data=，所以不能直接用paramUrl.split('data=')[1]来截取json字符串，会被截断
            var indexData = paramUrl.indexOf('data=');
            var dataStr = paramUrl.substring(indexData + 'data='.length);
            var dataObj = window.JSON.parse(dataStr);
            var data = {...dataObj,...wapdata};
            if(!data.cParam)
            {
                data = {...data,...{
                    'cParam': {
                        'fromurl': window.location.href,
                        'from': 'wap',
                        'fromposition':'wap'
                    }
                }};
            }
            else
            {
                if(!data.cParam.fromposition)
                {
                    data.cParam.fromposition = 'wap';
                }
            }
            if(isWeixin){
                data.cParam.from='weixin';
            }
            appUrl = paramUrl.split('?')[0] + '?data=' + window.encodeURIComponent(window.JSON.stringify(data));
            if (!/os (9|1\d)_/.test(ua)) {
                //不是ios9
                this.timeload = window.setTimeout(function () {
                    _self.download(time, args);
                }, this.conf.timeout);
                _self.loadToAppFrame(appUrl);
            } else {
                // _self.goToApp(root_url + appUrl);
                window.location.href = wapdata.other_url + '?data=' + window.encodeURIComponent(window.JSON.stringify(data));
            }
            return false;
        }
        return true;
    },
    download: function (time, arg) {
        //var root_url = root_url || this.conf.url;
        //window.console.log(root_url + arg);
        (Date.now() - time < this.conf.timeout + 200) && (window.location.href = arg);
    },
    loadToAppFrame: function (url) {

        this.loadFrameCallback(url);
    }
};
/**
 * dom示例：
 *  <a  href="#"  class="download-cell-btn" data-widget="com/mobile/page/misc/go_ganji_app/goApp.js"
 data-url="http://3g.ganji.com/ajax.php?dir=common&amp;module=check_click_d
 ownload&amp;uid=0xafee7decc528708740e7e2a846f7ebb&amp;next=http://ganji.cn/t/VSNnOE"
 data-name="urlToNativePage" data-gjalog="mta/list/fc" data-root_url="http://sta.ganji.com/att/project/touch/download_app/index.html?"
 data-param_url="ganji://app?data={}" data-role="link" data-category_id='2' data-jump_type='postlist',data-title='急招导购'>立即打开</a>
 跳转策略：
 ios9 root_url+param_url
 ios: url
 andriod:url
 */
var ToApp = {
    events: {},
    init: function (config,setHrefCallback,loadFrameCallback,onClick) {
        /**
         * root_url----data-root_url,引导页的url
         * url---转到app的url
         * arg：download的跳转url
         * other_url-----data-other_url:ios9及以上的跳转地址
         */
        var ua = navigator.userAgent.toLowerCase();
        isWeixin=window.navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger')>-1;
        var _self = this;
        this.config = config;
        var other_url = this.config.other_url || 'https://applesite.ganji.com';//ios9以及以上的跳转地址
        var root_url = this.config.root_url || 'http://sta.ganji.com/att/project/touch/download_app/index.html?';//引导页
        var opt = {
            title: window.document.title,
            url: window.location.href,
            open_mode: 7,
            is_login: 0,
            arg: config.url,//下载地址
            root_url: root_url,
            other_url: other_url,
            paramUrl: isWeixin ? 'ganji://app?data={"cParam":{"from":"weixin"}}':'ganji://app?data={"cParam":{"from":"wap"}}'
        };
        var wapdata = {
            arg: config.url,//下载地址
            root_url: root_url,//引导页面的地址
            other_url: other_url,//ios9 及以上的跳转地址
            schemaParm: opt.paramUrl.split('data=')[0]//gani://
        };
        GoGanjiApp.init(config,setHrefCallback,loadFrameCallback);
        if (!NativeAPI.isSupport() && /os (9|1\d)_/.test(ua)) {
            //是ios9以上
            var cur_url = window.location.href;
            var data = {...{
                url: this.config.jump_type,
                'cParam': {
                    fromurl: cur_url,
                    from: 'wap'
                },
                bParam: {
                    title: this.config.title || '',
                    category_id: this.config.category_id
                }
            }, ...wapdata};
            if(isWeixin){
                data.cParam.from='weixin';
            }
            var other_url = other_url + '?data=' + window.encodeURIComponent(window.JSON.stringify(data));
            // this.config.$el[0].href = other_url;
            setHrefCallback(other_url);
        } else {
            this.toNativeView = ()=>{
                this.goNativeView();
            }
        }
    },
    goNativeView: function () {
        if (GoGanjiApp.install()) {
            var config, url, reg;
            config = this.config;
            url = config.urlPage;
            url && navigator.userAgent.toLocaleLowerCase().indexOf('android')>0 && (url = url.replace(/#(.*)#/, '$1'));
            reg = /^gjgc:\/\/topicFeedList\?*?/;
            if (config.name && config.name === 'urlToNativePage' && url && reg.test(url)) {
                NativeAPI.invoke(
                    'getDeviceInfo',
                    null,
                    function (err, data) {
                        if (err) {
                            return;
                        }
                        if (data.versionId) {

                            var v = data.versionId.replace(/^(\d+\.\d+)\.(\d+)$/, function (v, a, b) {
                                return a + b;
                            });

                            var iosId = 6.66;
                            var androidId = 6.67;

                            if ((data.os.indexOf('android')===-1&& parseFloat(v) < iosId) || (data.os.indexOf('android')>0 && parseFloat(v) < androidId)) {
                                NativeAPI.invoke(
                                    'alert',
                                    {
                                        title: '',
                                        message: '当前版本太低，无法跳转到新功能，请升级并享用新功能',
                                        btn_text: '关闭'
                                    },
                                    function (err, data) {
                                        if (err) {
                                            return;
                                        }
                                        switch (data.value) {
                                            case data.YES:
                                                break;
                                            case data.NO:
                                                break;
                                            case data.CLOSE:
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                );
                                return;
                            }
                        }
                    }
                );
            }
            NativeAPI.invoke('createNativeView', {
                name: config.name,
                data: {
                    pagetype: config.pagetype,
                    userid: config.userid,
                    groupid: config.groupid,
                    url: url
                }
            });
        }
    }
};
module.exports = ToApp;