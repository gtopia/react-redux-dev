/**
 * Author: zhiyou
 * Date: 2017/05/12
 * Description: 收藏提示组件。对于QQ和UC浏览器，Android收藏到主屏幕，IOS添加到书签。对于IOS的Safari浏览器显示收藏提醒。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import cookieUtil from '../../static/util/cookie.js';
import browserUtil from '../../static/util/browser.js';
import osUtil from '../../static/util/os.js';

class Favorite extends Component {
    constructor(props) {
        super(props);
        this._closeFav = ::this._closeFav;
        this._closeFavGuide = ::this._closeFavGuide;
        this._addFav = ::this._addFav;
        this._cookieHandler = {
            key: 'FAV_PROMPT',
            timeInterval: 1 * 24 * 60 * 60 * 1000,
            isExpired: function() {
                return (cookieUtil.getCookie(this.key) === '');
            },
            getCurTime: function() {
                var date = new Date();
                var hour = date.getHours();
                var min = date.getMinutes();

                return hour * 60 * 60 * 1000 + min * 60 * 1000;
            },
            setExpires: function(time) {
                cookieUtil.setCookie({
                    key: this.key,
                    value: 1,
                    expires: time - this.getCurTime()
                });
            }
        };
        this._favHandler = {
            favTimer: null,
            favGuideTimer: null,
            setIframe: function(url) {
                var div = document.createElement('div');
                div.style.display = 'none';
                document.body.appendChild(div);
                div.innerHTML = '<iframe src="' + url + '" style="" />';
            },
            addFav: function() {
                // Android收藏到主屏幕，IOS添加到书签。
                if (browserUtil.QQ && !browserUtil.WX) {
                    this.setIframe("http://so.sina.cn/browser/js.d.api?from=qq&act=bookmark_add");
                }

                if (browserUtil.UC && !browserUtil.WX) {
                    if (osUtil.android) {
                        this.setIframe("ext:add_favorite");
                    }
                    else if (osUtil.ios) {
                        window.location.href = "ext:add_favorite";
                    }
                }
            }
        };
    }

    componentWillMount() {
        let _this = this;
        const { showFav, closeFav, showFavGuide, closeFavGuide } = this.props;

        if (this._cookieHandler.isExpired() && !browserUtil.WX && !browserUtil.WB) {
            if ((browserUtil.QQ || browserUtil.UC) && (osUtil.android || osUtil.ios)) {
                // 显示添加收藏
                showFav();
                closeFavGuide();
                this._favHandler.favTimer = setTimeout(function() {
                    _this._closeFav();
                }, 10 * 1000);
            }
            else if (osUtil.ios && browserUtil.SAFARI) {
                // 显示收藏指引
                closeFav();
                showFavGuide();
                this._favHandler.favGuideTimer = setTimeout(function() {
                    _this._closeFavGuide();
                }, 10 * 1000);
            }
        }
    }

    _closeFav() {
        const { closeFav } = this.props;

        clearTimeout(this._favHandler.favTimer);
        this._cookieHandler.setExpires(this._cookieHandler.timeInterval);
        closeFav();
    }

    _closeFavGuide() {
        const { closeFavGuide } = this.props;

        clearTimeout(this._favHandler.favGuideTimer);
        this._cookieHandler.setExpires(this._cookieHandler.timeInterval);
        closeFavGuide();
    }

    _addFav() {
        const { closeFav } = this.props;

        clearTimeout(this._favHandler.favTimer);
        this._favHandler.addFav();
        closeFav();
    }

    render() {
        const { isShowFav, isShowFavGuide } = this.props;
        let favClass = classNames({
            'layout__fav': isShowFav,
            'layout__favguide': isShowFavGuide,
            'hide': !(isShowFav || isShowFavGuide)
        });

        let Fav = () => {
            let renderHTML = <div></div>;

            if (isShowFav) {
                renderHTML = (
                    <div className="fav__container">
                        <div className="fav__img"></div>
                        <p className="fav__title">添加收藏</p>
                        <p className="fav__intro">更方便的了解热门话题</p>
                        <div className="fav__add" onClick={this._addFav}>
                            <p className="add__text">收 藏</p>
                        </div>
                        <i className="fav__close" onClick={this._closeFav}></i>
                    </div>
                );
            }
            else if (isShowFavGuide) {
                renderHTML = (
                    <div className="fav__container">
                        <div className="fav__img"></div>
                        <p className="fav__title">添加到主屏幕</p>
                        <p className="fav__intro">更方便的了解热门话题</p>
                        <i className="fav__guide-icon"></i>
                        <p className="fav__guide-text">点击下方的按钮</p>
                        <i className="fav__close" onClick={this._closeFavGuide}></i>
                    </div>
                );
            }

            return renderHTML;
        };

        return (
            <div className={favClass}><Fav/></div>
        );
    }
}

Favorite.propTypes = {
    isShowFav: PropTypes.bool,
    isShowFavGuide: PropTypes.bool,
    showFav: PropTypes.func,
    closeFav: PropTypes.func,
    showFavGuide: PropTypes.func,
    closeFavGuide: PropTypes.func,
};

Favorite.defaultProps = {
    isShowFav: false,
    isShowFavGuide: false,
    showFav: () => {},
    closeFav: () => {},
    showFavGuide: () => {},
    closeFavGuide: () => {},
};

export default Favorite;
