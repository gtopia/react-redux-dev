/**
 * Author: zhiyou
 * Date: 2017/10/13
 * Description: 个人中心页面。
 */
import './index.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import wxShare from '../../static/util/wxShareCustom.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import * as AppActions from '../../actions/app';
import reqObj from '../../static/util/request.js';
import apis from '../../constants/apis.js';
import { LOGO_SHARE, DEFAULT_FACE } from '../../constants/app.js';

class Me extends Component {
    constructor(props) {
        super(props);

        this.conf = {
            'uid': ''
        };

        this.api = {
            'usercmnts': '//comment5.news.sina.com.cn/user/cmnt',
            'usertopics': apis.MY_TOPIC_SUM
        };

        this.state = {
            'isHidePrompt': true,
            'cmntCount': 0,
            'topicCount': 0
        };
    }

    componentWillMount() {
        window.document.title = "我 - 全民话题";

        wxShare.init({
            url: 'http://topic.sina.cn',  //分享链接
            title: '全民话题，用不同视角发现新闻', //分享标题
            content: 'http://topic.sina.cn', //分享描述（分享朋友时会显示）
            pic: LOGO_SHARE //分享图片路径
        });

        this.props.appActions.checkLoginStatus();
    }

    componentDidMount() {
        let totalHeight = $('.layout__app').height() || 667;
        let headerHeight = $('.layout__header').height() || 0;
        let menuHeight = $('.layout__menu').height() || 0;

        $('.layout__me').css({
            'min-height': totalHeight - headerHeight - menuHeight + 'px'
        });
    }

    componentWillReceiveProps(nextProps) {
        let _this = this;
        let uInfo = nextProps.appState.userInfo;

        if (uInfo.uid && uInfo.uid!=this.conf.uid) {
            this.conf.uid = uInfo.uid;

            // 获取评论数
            let getUserCmnts = {
                'option': {
                    url: _this.api.usercmnts,
                    data: {
                        'uid': uInfo.uid || ''
                    },
                    type: 'GET',
                    timeout: 10000
                },
                'successCb': function(res) {
                    var data = res.result;

                    if (data && data.status && data.status.code===0 && data.count) {
                        _this.setState({
                            'cmntCount': data.count.show || 0
                        });
                    }
                },
            };
            reqObj.request(getUserCmnts.option, getUserCmnts.successCb);

            // 获取关注的话题数
            let getUserTopics = {
                'option': {
                    url: _this.api.usertopics,
                    data: {
                        'uid': uInfo.uid || ''
                    },
                    type: 'GET',
                    timeout: 10000
                },
                'successCb': function(res) {
                    var data = res.result;

                    if (data && data.status && data.status.code===0 && data.data) {
                        _this.setState({
                            'topicCount': data.data.count || 0
                        });
                    }
                }
            };
            reqObj.request(getUserTopics.option, getUserTopics.successCb);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextProps.appState) === JSON.stringify(this.props.appState) &&
            JSON.stringify(nextState) === JSON.stringify(this.state)
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    componentWillUpdate() {
        let totalHeight = $('.layout__app').height() || 667;
        let headerHeight = $('.layout__header').height() || 0;

        // 登录状态时，设置mask高度
        if ($('.me__logout_mask').length) {
            $('.me__logout_mask').css({
                'height': totalHeight - headerHeight + 'px'
            });
        }
    }

    _showPrompt() {
        this.setState({
            'isHidePrompt': false
        });

        setTimeout(function() {
            this.setState({
                'isHidePrompt': true
            });
        }.bind(this), 1500);
    }

	render() {
        let { 
            userInfo, 
            isWant2Logout, 
        } = this.props.appState;
        let { 
            handleLogin,
            want2Logout, 
            cancelLogout, 
            handleLogout
        } = this.props.appActions;
        let logoutMaskClass = classNames({
            'me__logout_mask': true,
            'hide': !isWant2Logout
        });
        let promptClass = classNames({
            'me__comingsoon': true,
            'hide': this.state.isHidePrompt
        });

        if (userInfo.islogin) {
            return (
                <div className="layout__me">
                    <div className="me__info">
                        <div data-sudaclick="personal_info">
                            <div className="me__portrait" 
                                 style={{'backgroundImage': 'url(' + (userInfo.userface || DEFAULT_FACE) + ')'}}></div>
                            <p className="me__name">{userInfo.nick || userInfo.uname}</p>
                        </div>

                        <div className="me__detail">
                            <div className="me__topics" onClick={this._showPrompt.bind(this)} data-sudaclick="personal_mytopic">
                                <p className="me__txt">我关注的话题</p>
                                <p className="me__num">{this.state.topicCount}</p>
                            </div>
                            <div className="me__divider"></div>
                            <div className="me__cmnts" data-sudaclick="personal_mycomment">
                                <p className="me__txt">我的评论</p>
                                <p className="me__num">{this.state.cmntCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="me__logout" onClick={want2Logout.bind(this)} data-sudaclick="personal_logout"></div>
                    <div className={logoutMaskClass}>
                        <div className="me__want2logout">
                            <div className="confirm__close" onClick={cancelLogout.bind(this)}></div>
                            <p className="confirm__question">确定要退出登录吗？</p>
                            <p className="confirm__alert">退出后将不能评论和回复</p>
                            <div className="confirm__cancel" onClick={cancelLogout.bind(this)}>
                                <p className="cancel__text">取消</p>
                            </div>
                            <div className="confirm__exit" onClick={handleLogout.bind(this)} data-sudaclick="personal_logout_confirm" >
                                <p className="exit__text">退出</p>
                            </div>
                        </div>
                    </div>

                    <div className={promptClass}>正在开发中，<br/>即将到来</div>
                    <div className="me__bgimg"></div>
                    <div className="me__textctner">
                        <p className="text--bold">更多功能建设中<br/>敬请期待</p>
                        <p className="text">COMING SOON</p>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="layout__me">
                    <div className="me__notlogin">
                        <p className="prompt">你还没有登录</p>
                        <div className="login-btn" onClick={handleLogin.bind(this)} data-sudaclick="personal_login">登 录</div>
                    </div>
                </div>
            );
        }
	}
}

Me.propTypes = {
    appState: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        appState: state.app.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(AppActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Me));
