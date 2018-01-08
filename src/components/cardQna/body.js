 /* 
 * Author: zhiyou
 * Date: 2017/11/27
 * Description: 问答卡片主体部分
 */
import './body.scss';
import 'swiper-css';
import Swiper from 'swiper';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DEFAULT_FACE } from '../../constants/app.js';

class BodyQna extends Component {
    constructor(props) {
        super(props);
        this.bodySwiper = null;

        // 子卡片内容不满460px时，显示全部内容；大于460px时，显示360px和查看全部按钮。
        this.overflowHeight = 360;
        this.maxHeight = 460;
    }

    componentDidMount () {
        $('.swiper-container').height(window.innerHeight + 'px');

        $(window).on('resize', function() {
            $('.swiper-container').height(window.innerHeight + 'px');   // 适配屏幕高度
        }); 
    }

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(nextProps.bodyData) === JSON.stringify(this.props.bodyData) &&
            nextProps.bodyState === this.props.bodyState
            ) {
            return false;
        }
        else {
            return true;
        }
    }

    componentDidUpdate () {
        if (!$('.body__swiper .swiper-container').length) {
            return;
        }

        this._setContentFoldRule();
        this._initSwiper();

        $('.body__swiper').addClass('zoomIn');
    }

    componentWillUnmount() {
        if (this.bodySwiper) {
            this.bodySwiper.destroy(true, true);
        }

        this.props.resetBodyState();
    }

    _setContentFoldRule() {
        let _this = this;
        let contentList = $('.body__item').find('.content');

        contentList.forEach(function(item) {
            if ($(item).height() > _this.maxHeight) {
                $(item).css({
                    'height': _this.overflowHeight + 'px',
                    'padding-bottom': 0
                });
                $(item).siblings('.mask').removeClass('hide');
                $(item).siblings('.toggle-all').removeClass('hide');
            }
        });
    }

    _initSwiper() {
        $('.swiper-wrapper, .swiper-slide').height($('.body__ctner').height());
        this.bodySwiper = new Swiper('.body__swiper .swiper-container', {
            scrollbar: '.swiper-scrollbar',
            direction: 'vertical',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            noSwiping: false,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        });
    }

    _toggleContent(e) {
        let $target = $(e.target);
        let txt = $target.text();

        if (txt == "展开全文") {
            $target.siblings('.mask').addClass('hide');
            $target.siblings('.content').height('auto');
            $target.text("收起全文");
        }
        else {
            $target.siblings('.mask').removeClass('hide');
            $target.siblings('.content').height(this.overflowHeight);
            $target.text("展开全文");
        }

        this._initSwiper();
    }

    render () {
        let _this = this;
        const { bodyData, showShare, bodyState, closeBody } = this.props;
        let bodySwiperClass = classNames({
            'body__swiper': bodyState,
            'hide': bodyState === null,
            'zoomOut': !bodyState,
        });
        const shareUrl = bodyData.share + "?id=" + bodyData.tid + "&scid=" + bodyData.cid + "&type=" + bodyData.type;
        let profileClass = classNames({
            'profile': true,
            'hide': !bodyData.profile
        });

        let bodyItems = bodyData.answerData && bodyData.answerData.map(function(item, index) {
            let d = new Date(parseInt(item.ftime));
            let fdate = d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';

            return (
                <div className="body__item" key={index} data-sudaclick="qanda_card">
                    <img className="portrait" src={item.authorImg || DEFAULT_FACE} alt="头像" />
                    <div className="intro">
                        <div className="name">{item.author}</div>
                        <div className="title">{item.authorDesc}</div>
                    </div>
                    <span className="date">{fdate}</span>
                    <div className="content" dangerouslySetInnerHTML={{__html:item.content}}></div>
                    <div className="mask hide"></div>
                    <div className="toggle-all hide" onClick={_this._toggleContent.bind(_this)}>展开全文</div>
                </div>
            );
        });

        return (
            <div className={bodySwiperClass}>
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide swiper-no-swiping">
                            <div className="body__ctner">
                                <div className="body__info">
                                    <div className="icon"></div>
                                    <a className="icon__share" 
                                        data-sudaclick="qanda_share"
                                        data-sharetype="card_qa"
                                        data-shareurl={shareUrl}
                                        data-sharetitle={bodyData.title}
                                        data-sharetopic={bodyData.tname}
                                        data-shareattend={bodyData.attend}
                                        data-shareanswerer={bodyData.answerer}
                                        onClick={showShare}>
                                        <i className="icon-i"></i>分享
                                    </a>
                                    <div className="title">{bodyData.title}</div>
                                    <div className={profileClass}>{bodyData.profile}</div>
                                </div>
                                {bodyItems}
                            </div>
                        </div>
                    </div>
                    <div className="swiper-scrollbar"></div>
                </div>
                <div className="body__close">
                    <a className="a-closed" data-sudaclick="qanda_card_close" onClick={closeBody}></a>
                </div>
            </div>
        );
    }
}

BodyQna.propTypes = {
    bodyState: PropTypes.bool,
    closeBody:  PropTypes.func,
    showShare: PropTypes.func,
    bodyData:  PropTypes.object,
    resetBodyState: PropTypes.func
};

BodyQna.defaultProps = {
    bodyState: null,
    closeBody: () => {},
    showShare: () => {},
    bodyData: {},
    resetBodyState: () => {}
};

export default BodyQna;
