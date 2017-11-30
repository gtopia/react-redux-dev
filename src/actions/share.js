 /* 
 * Author: jinping3
 * Date: 2017/05/10
 * Description: share actions
 * Modify: zhiyou@2017/07/13 修改分享文案
 *         zhiyou@2017/07/14 添加resetShareState；自动隐藏引导弹层。
 *         zhiyou@2017/11/02 修复浏览器分享到微信与朋友圈功能异常。
 */

import topicTypes from '../constants/topic.js';
import { LOGO_SHARE } from '../constants/app.js';
import Browser from '../static/util/browser.js';
import Os from '../static/util/os.js';
import wxShare from '../static/util/wxShareCustom.js';

//点击微博
export function weiboShare(url) {
    return {
        type: topicTypes.WEIBOSHARE,
        url
    };
}

//隐藏微信分享弹出层
export function hideWXShare() {
    return {
        type: topicTypes.HIDEWXSHARE
    };
}

//点击微信
export function wechatShare(state) {
    return (dispatch) => {
        dispatch({
            type: topicTypes.WECHATSHARE,
            state
        });

        // 3秒后隐藏分享引导层
        setTimeout(function() {
            dispatch(hideWXShare());
        }, 3000);
    };
}

//显示分享组件
export function showShareFunc(shareData) {
    return {
        type: topicTypes.SHOWSHARE,
        shareData
    };
}

//显示分享组件
export function showShare(e) {
    return (dispatch) => {
        let $e = null;

        if ($(e.target).attr('class') == 'share' || 
            $(e.target).attr('class') == 'card-icon__share' || 
            $(e.target).attr('class') == 'icon__share') {
            $e = $(e.target);
        }
        else if ($(e.target).parents('.card-icon__share').length > 0) {
            $e = $(e.target).parents('.card-icon__share');
        }
        else if ($(e.target).parents('.icon__share').length > 0) {
            $e = $(e.target).parents('.icon__share'); 
        }

        let shareType = $e.attr('data-sharetype');
        let shareUrl = $e.attr('data-shareurl');
        let shareAttend = $e.attr('data-shareattend');
        let topicTitle = "";
        let wbShareUrl = "";
        let wbShareTitle = "";
        let shareData = {};
        let wxShareTitle = "";
        let wxShareContent = "";

        switch (shareType) {
            case 'topic': {
                let customTitle = $e.attr('data-customtitle');
                let customContent = $e.attr('data-customcontent');
                topicTitle = $e.attr('data-sharetitle');

                wxShareTitle = customTitle ? customTitle : (shareAttend + '人正在参与话题＃' + topicTitle + '＃');
                wxShareContent = customContent ? customContent : '全民话题，用不同视角发现新闻';

                wbShareTitle = customTitle ? customTitle : ('我正在参与全民话题＃' + topicTitle + '＃');
                wbShareUrl = [
                    '//service.weibo.com/share/mobile.php?url=' + encodeURIComponent(shareUrl+'?s=weibo&appkey=3720547781'),
                    '&title=' + encodeURIComponent(wbShareTitle)
                ].join('');

                break;
            }
            case 'card': {
                let cardTitle = $e.attr('data-sharetitle');
                topicTitle = $e.attr('data-sharetopic');

                wxShareTitle = cardTitle;
                wxShareContent = shareAttend + '人正在参与话题＃' + topicTitle + '＃';

                wbShareTitle = cardTitle + '　我正在参与全民话题＃' + topicTitle + '＃';
                wbShareUrl = [
                    '//service.weibo.com/share/mobile.php?url=' + encodeURIComponent(shareUrl+'?s=weibo&appkey=3720547781'),
                    '&title=' + encodeURIComponent(wbShareTitle),
                    '&pic=' + LOGO_SHARE
                ].join('');

                break;
            }
            case 'card_qa': {
                let answerer = $e.attr('data-shareanswerer') || "";
                let cardTitle = $e.attr('data-sharetitle');
                topicTitle = $e.attr('data-sharetopic');

                wxShareTitle = answerer.split(',')[0] + "回答了" + cardTitle;
                wxShareContent = shareAttend + '人正在参与话题＃' + topicTitle + '＃';

                wbShareTitle = cardTitle + '　我正在参与全民话题＃' + topicTitle + '＃';
                wbShareUrl = [
                    '//service.weibo.com/share/mobile.php?url=' + encodeURIComponent(shareUrl+'?s=weibo&appkey=3720547781'),
                    '&title=' + encodeURIComponent(wbShareTitle),
                    '&pic=' + LOGO_SHARE
                ].join('');

                break;
            }
            default: {
                break;
            }
        }

        shareData = {
            url: shareUrl, 
            title: wxShareTitle, 
            attend: shareAttend, 
            contents: wxShareContent, 
            img: LOGO_SHARE
        };

        dispatch(weiboShare(wbShareUrl));
        dispatch(showShareFunc(shareData));

        wxShare.init({
            url: shareUrl,  //分享链接
            title: wxShareTitle, //分享标题
            content: wxShareContent, //分享描述（分享朋友时会显示）
            pic: LOGO_SHARE //分享图片路径
        });
    };
}

//隐藏分享组件
export function hideShare() {
    return {
        type: topicTypes.HIDESHARE
    };
}

//重置shareState为null，用于控制弹层初始动效
export function resetShareState() {
    return {
        type: topicTypes.RESET_SHARE
    };
}

 /*
 * Description: UC微信分享
 * @param  {bool} shareStatus 是否启用分享
 * @param  {number} typeUC 在UC中点击的是 1：朋友 or 是2：朋友圈
 * @param  {object} shareData 分享的数据
 */
export function initUCBrowser(shareStatus, typeUC, data){

    function ucShareWechat(type) {
        var shareData = {
            title: data.title,
            url: data.url,
            content: data.description,
            platform: '',
            disablePlatform: '',
            source: '',
            htmlId: ''
        };
        if (Os.ios) { // ios接口
            //alert('ios');
            if (type === 1) {
                // 微信好友
                shareData.platform = 'kWeixin';
            } else if (type === 2) {
                // 微信朋友圈
                shareData.platform = 'kWeixinFriend';
            }
            window.ucbrowser && window.ucbrowser.web_share(shareData.title, shareData.content, shareData.url, shareData.platform, shareData.disablePlatform, shareData.source, shareData.htmlId);
        } else if (Os.android) { // android接口
            //alert(window.ucweb);
            if (type === 1) {
                // 微信好友
                shareData.platform = 'WechatFriends';
            } else if (type === 2) {
                // 微信朋友圈
                shareData.platform = 'WechatTimeline';
            }
            window.ucweb && window.ucweb.startRequest('shell.page_share', [shareData.title, shareData.content, shareData.url, shareData.platform, shareData.disablePlatform, shareData.source, shareData.htmlId]);
        }
    };
    if (shareStatus) {
        ucShareWechat(typeUC);
    }
    
    return {
        type: topicTypes.UCWX
    };
}


 /*
 * Description: QQ微信分享
 * @param  {number} typeQQ 在UC中点击的是 2：朋友 or 是1：朋友圈
 * @param  {object} shareData 分享的数据
 */
export function initQQBrowser(typeQQ, shareData) {
    var UA,qq;
    UA = navigator.appVersion;
    qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
    var qqBridgeDone = false;
    
    function loadqqApi(cb) {

        if (!qq) { // qq == 0 
            return cb && cb();
        }
        var qqApiScript = document.createElement('script');
        qqApiScript.onload = function () {cb && cb();};
        qqApiScript.onerror = function () {};
        // qq == 1 低版本 qq == 2 高版本
        qqApiScript.src = (qq == 1 ) ? '//3gimg.qq.com/html5/js/qb.js' : '//jsapi.qq.com/get?api=app.share';
        document.body.appendChild(qqApiScript);

    }

    function qqShare(config) {

        var type = config.to_app;
        //微信好友1, 微信朋友圈8
        type = type ? ((type == 1) ? 8 : 1) : ''; 

        var share = function () {
            var shareInfo = {
                'url': config.url,
                'title': config.title,
                'description': config.description,
                'img_url': config.img_url,
                'to_app': type,
            };

            if (window.browser) {
                window.browser.app && window.browser.app.share(shareInfo);
            } else if (window.qb) {
                window.qb.share && window.qb.share(shareInfo);
            }
        };

        if (qqBridgeDone) {
            share();
        } else {
            loadqqApi(share);
        }
    };

    function mShare(config) {
        this.config = config;
        this.init = function (to_app) {
            if (typeof to_app != 'undefined'){
                this.config.to_app = to_app;
            }
            try {
                qqShare(this.config);
                
            } catch (e) {}
        };
    };

    loadqqApi(function () {
        qqBridgeDone = true;
    });

    var mshare = new mShare(shareData);
    //2:朋友 1：朋友圈
    mshare.init(typeQQ);

    return {
        type: topicTypes.QQWX
    };
}

//初始化微信分享
export function initWechat(e) {
    return (dispatch) => {
        let className = $(e.target).parents('a').attr('class'), typeQQ, typeUC;

        if (className == 'weixin') {
            typeQQ = 2;
            typeUC = 1;
        }
        else if (className == 'pengyouquan') {
            typeQQ = 1;
            typeUC = 2;
        }

        //获取分享数据
        var $SDW = $('.shareDataWarper');
        var shareData = {
            url: $SDW.attr('data-url'),
            img_url: $SDW.attr('data-img'),
            title: $SDW.attr('data-title'),
            description: $SDW.attr('data-contents')
        };

        function getVersion(str) {
            var arr = str.split('.');

            return parseFloat(arr[0]+'.'+arr[1]);
        };
        
        if (Browser.QQ) { //QQ浏览器呼起微信
            /*let state = {
                warpState: false,
                safariState: false,
                wxState: false
            };
            dispatch(wechatShare(state));*/
            dispatch(initQQBrowser(typeQQ,shareData));
        }
        else if (Browser.UC) { //UC浏览器呼起微信
            var ucVersion = getVersion(Browser.UA.split('ucbrowser/')[1]);
            var shareStatus = false; // 是否启用分享
    
            if (Os.ios) {
                if (ucVersion >= 10.2) {
                    shareStatus = true;
                }
            } 
            else if (Os.android) {
                if (ucVersion >= 9.7) {
                    shareStatus = true;
                }
            }

            let state = {
                warpState: false,
                safariState: false,
                wxState: false
            };

            dispatch(wechatShare(state));
            dispatch(initUCBrowser(shareStatus,typeUC,shareData));
        }
        else if (Browser.WX || Browser.UA.match(/QQ\//i) == 'QQ/') { //微信及QQ内置浏览器
            let state = {
                warpState: true,
                safariState: false,
                wxState: true
            };

            dispatch(wechatShare(state));
        }      
        else {
            // Safari或其他浏览器
            let state = {
                warpState: true,
                safariState: true,
                wxState: false
            };
            dispatch(wechatShare(state));
        }
    };
};


