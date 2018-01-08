 /* 
 * Author: jinping3
 * Date: 2017/05/10
 * Description: 话题页面---分享组件
 * Modify: zhiyou@2017/07/14 添加分享底部弹层动效。
           zhiyou@2017/07/18 修复分享图标位置错误。分享后关闭弹层。
           zhiyou@2017/09/11 修复Firefox event报错。
           zhiyou@2017/11/03 修复分享图标显示不全bug。
           zhiyou@2017/12/06 添加shouldComponentUpdate函数，优化组件性能。
 */
import './index.scss';
import React, { Component }from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Share extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.shareWeiboUrl === this.props.shareWeiboUrl &&
            nextProps.shareState === this.props.shareState &&
            JSON.stringify(nextProps.shareData) === JSON.stringify(this.props.shareData)) {
            return false;
        }
        else {
            return true;
        }
    }

    componentDidUpdate(){
        $('.share-warper').on('touchmove', function(e) {
            e.preventDefault();
        });
    }

    componentWillUnmount() {
        this.props.resetShareState();
    }

    _handleShareWeibo() {
        this.props.closeShare();
        window.location.href = this.props.shareWeiboUrl;
    }

    _handleShareWx(e) {
        this.props.closeShare();
        this.props.wechatShare(e);
    }

    _handleShareWxFriends(e) {
        this.props.closeShare();
        this.props.pengyouquanShare(e);
    }

    render() {
        let shareWarper= classNames({
            'share-warper': true,
            'pullDown': (this.props.shareState!==null && !this.props.shareState) ? () => { 
                setTimeout(function() {
                    return true;
                }, 10);
            } : false,
            'share-warper--hide': this.props.shareState===null
        });
 
        let shareOption = classNames({
            'share-warper__box': true,
            'pullUp': this.props.shareState ? () => { 
                setTimeout(function() {
                    return true;
                }, 10);
            } : false
        });

        return (   
            <div className={shareWarper}>
                <div className="shareDataWarper" 
                    data-url={this.props.shareData.url}
                    data-img={this.props.shareData.img}
                    data-title={this.props.shareData.title}
                    data-contents={this.props.shareData.contents}></div>
                
                <div className="shareWarper-click" onClick={this.props.closeShare}></div>

                <div className={shareOption} data-sudaclick="share_1">
                    <p className="share-warper__box-p">分享到</p>
                    <a className="share-warper__box-closed" onClick={this.props.closeShare}></a>
                    <ul className="share-warper__box-ul">
                        <li className="share__item">
                            <a onClick={this._handleShareWeibo.bind(this)}>
                            <i className="icon-weibo"></i>微博
                            </a>
                        </li>
                        <li className="share__item">
                            <a className="weixin" onClick={this._handleShareWx.bind(this)}>
                            <i className="icon-wechat"></i>微信
                            </a>
                        </li>
                        <li className="share__item">
                            <a className="pengyouquan" onClick={this._handleShareWxFriends.bind(this)} value="pengyouquan">
                            <i className="icon-pengyouquan"></i>朋友圈
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

Share.propTypes = {
    shareWeiboUrl: PropTypes.string,
    shareState: PropTypes.bool,
    closeShare: PropTypes.func,
    resetShareState: PropTypes.func,
    weiboShare: PropTypes.func,
    wechatShare: PropTypes.func,
    pengyouquanShare: PropTypes.func,
    shareData: PropTypes.object
};

Share.defaultProps = {
    shareWeiboUrl: '',
    shareState: null,
    closeShare: () => {},
    resetShareState: () => {},
    weiboShare: () => {},
    wechatShare: () => {},
    pengyouquanShare: () => {},
    shareData: {}
};

export default Share;




