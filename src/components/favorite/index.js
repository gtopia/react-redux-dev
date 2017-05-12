import './index.scss';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import cookieUtil from '../../static/util/cookie.js';
import browserUtil from '../../static/util/browser.js';
import osUtil from '../../static/util/os.js';

class Favorite extends Component {
    constructor(props) {
        super(props);
        let _this = this;
        this._closeFav = ::this._closeFav;
        this._addFav = ::this._addFav;

        this._cookieHandler = {
            key: 'ADDFAV_POPUP',
            closeDay: 3 * 24 * 60 * 60 * 1000,
            disappearDay: 1 * 24 * 60 * 60 * 1000,
            isOutDate: function() {
                if (cookieUtil.getCookie(this.key) === '') {
                    return true;
                }
                else {
                    return false;
                }
            },
            getNow: function() {
                var date = new Date();
                var hour = date.getHours();
                var min = date.getMinutes();

                return hour * 60 * 60 * 1000 + min * 60 * 1000;
            },
            setOutDateCookie: function(time) {
                cookieUtil.setCookie({
                    key: this.key,
                    value: 1,
                    expires: time - this.getNow()
                });
            }
        };

        this._otherRequst = (url) => {
            var div = document.createElement('div');
            div.style.display = 'none';
            document.body.appendChild(div);
            div.innerHTML = '<iframe src="' + url + '" style="" />';
        };

        this._addFavPopup = () => {
            if (!_this._cookieHandler.isOutDate() || browserUtil.WX || browserUtil.WB) {
                return;
            }

            var method = {
                isShow: false,
                timeoutIde: '',
                init: function($pop,isAddBookMark) {
                    this.$pop = $pop;
                    this.initBtn(isAddBookMark);
                    this.show();
                },
                initBtn: function(isAddBookMark) {
                    var _self = this;
                    function closeHandler(){
                        clearTimeout(_self.timeoutIde);
                        _this._cookieHandlercookieHandler.setOutDateCookie(_this._cookieHandlercookieHandler.closeDay);
                        _self.$pop.fadeOut(300);
                    }
                    this.$pop.find('.close').on('click', function() {
                        closeHandler();
                    });
                    if (isAddBookMark){
                        this.$pop.find('.sure-btn').on('click',function(){
                            closeHandler();
                            //调用浏览器书签
                            _self.addAction();
                        });
                    }
                },
                show: function() {
                    var _self = this;
                    window.SUDA.uaTrack("newsmob_aiyowoqu", "body_cxcx_1_1");
                    _self.$pop.css({
                        'display': 'block'
                    });
                    _self.timeoutIde = setTimeout(function() {
                        _this._cookieHandlercookieHandler.setOutDateCookie(_this._cookieHandlercookieHandler.disappearDay);
                        _self.$pop.fadeOut(300);
                    }, 10 * 1000);
                },
                /**
                 * 点击添加到收藏夹
                 */
                addAction: function() {
                    //判断浏览器
                    if (browserUtil.QQ && !browserUtil.WX) {
                        _this._otherRequst("http://so.sina.cn/browser/js.d.api?from=qq&act=bookmark_add");
                    }
                    if (browserUtil.UC && !browserUtil.WX) {
                        //没有判断版本
                        if (osUtil.android) {
                            _this._otherRequst("ext:add_favorite");
                        }
                        else if (osUtil.ios) {
                            window.location.href = "ext:add_favorite";
                        }
                    }
                }
            };
            console.log(method);
            // require.ensure([], function(require) {
            //     var tpl;
            //     require('./scss/pop.scss');
            //     if((isQQBrowser || isUCBrowser) && !isWX && os.android){
            //         tpl = require('./tpl/android-qq-uc-pop.tpl');
            //         $('body').append(tpl());
            //         method.init($(".android-pop-bookmark"),true);
            //     }else if((isQQBrowser || isUCBrowser) && !isWX && os.ios){
            //         tpl = require('./tpl/ios-qq-uc-pop.tpl');
            //         $('body').append(tpl());
            //         method.init($(".ios-qq-uc-pop"),true);
            //     }else if(os.ios && brower.SAFARI){
            //         tpl = require('./tpl/pop.tpl');
            //         $('body').append(tpl());
            //         method.init($(".ios-pop-disktop"),false);
            //     }
            // });
        };
    }

    componentWillMount() {
    }

    _closeFav() {
        const { closeFav } = this.props;

        closeFav();
    }

    _addFav() {
        console.log('>>> add fav');
    }

    render() {
        const { isShowFav } = this.props;
        let favoriteClass = classNames({
            'layout__fav': true,
            'hide': !isShowFav
        });

        return (
            <div className={favoriteClass}>
                <div className="fav__img"></div>
                <p className="fav__title">添加收藏</p>
                <p className="fav__intro">更方便的了解热门话题</p>
                <div className="fav__add" onClick={this._addFav}><p>收 藏</p></div>
                <div className="fav__close" onClick={this._closeFav}></div>
            </div>
        );
    }
}

Favorite.propTypes = {
    isShowFav: PropTypes.bool,
    closeFav: PropTypes.func,
};

Favorite.defaultProps = {
    isShowFav: false,
    closeFav: () => {},
};

export default Favorite;
