/**
 * Author: tongtong3
 * Date: 2017/05/17
 * Description: 微信自定义分享
 * Modify: zhiyou@2017/07/04 修改代码，通过Eslint语法检查
 */
module.exports = {
    wxIsRq: false, //是否加载微信依赖文件
    init: function(opt) {
        if (!opt) {
            return;
        }

        var _self = this;
        this.title = opt.title || '';
        this.url = _self.addProtocol(opt.url);
        this.pic = _self.addProtocol(opt.pic);
        this.content = opt.content || '';

        if (!this.wxIsRq) {
            this.wxIsRq = true;
            var script = document.createElement('script');
            script.onload = function() {
                //初始化wx相关代码
                _self.initWXConfig();
            };
            script.type = 'text/javascript';
            script.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
            $('body').append(script);
        } else {
            _self.initWXConfig();
        }
    },
    addProtocol: function(url) {
        var purl = url;

        if (url && !/^http/i.test(url)) {
            purl = window.location.protocol + url;
        }

        return purl;
    },
    initWxRrady: function() {
        var _self = this;

        function regWxShare(shareData) {
            //分享到朋友圈配置
            window.wx.onMenuShareTimeline({
                title: shareData.title, // 分享标题
                link: shareData.url, // 分享链接
                imgUrl: shareData.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    // 分享成功后调用推荐的列表
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享给朋友的配置
            window.wx.onMenuShareAppMessage({
                title: shareData.title, // 分享标题
                desc: shareData.desc, // 分享描述
                link: shareData.url, // 分享链接
                imgUrl: shareData.imgUrl, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                    // $(".share-mask,.share,.wx-pop-share").hide();
                    // sharePush.show();
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

            window.wx.onMenuShareQQ({
                title: shareData.title, // 分享标题
                desc: shareData.desc, // 分享描述
                link: shareData.url, // 分享链接
                imgUrl: shareData.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

            window.wx.onMenuShareQZone({
                title: shareData.title, // 分享标题
                desc: shareData.desc, // 分享描述
                link: shareData.url, // 分享链接
                imgUrl: shareData.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
        }

        window.wx.ready(function() {
            //初始化 推荐列表
            //分享的数据
            var shareData = {
                title: _self.title,
                url: _self.url,
                imgUrl: _self.pic,
                desc: _self.content
            };
            regWxShare(shareData);
        });
    },
    initWXConfig: function() {
        //在微信wx.ready事件初始化自定义分享信息事件
        this.initWxRrady();
        $.ajax({
            url: '//datanews.mix.sina.com.cn/?&p=weixin&format=json',
            data: {
                url: location.href.indexOf('#') >= 0 ? location.href.substring(0, location.href.indexOf('#')) : location.href
            },
            dataType: 'jsonp',
            success: function(data) {
                if (data.result.status.code !== 0) {
                    console.log('error,%o', data);
                    return;
                }

                var result = data.result;
                //微信分享配置相关内容
                window.wx.config({
                    // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: result.data.appId, // 必填，公众号的唯一标识
                    timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
                    signature: result.data.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            },
            error: function() {}
        });
    }
};
