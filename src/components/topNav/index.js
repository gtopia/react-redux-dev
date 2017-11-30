/**
 * Author: zhiyou
 * Date: 2017/05/09
 * Description: 导航组件。包含登录登出功能。
 * Modify: zhiyou@2017/10/11: v2.1.0需求，去除登录登出功能。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// import { MAIN_URL } from '../../constants/app';
// import classNames from 'classnames';

// let MoreTopic = ({history}) => {
//     let gotoMainPage = () => {
//         history.push(MAIN_URL + window.location.search);

//         // SUDA PV统计
//         window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.host + window.location.search);
//     };

//     return (
//         <div className="nav__moretopic" onClick={gotoMainPage} data-sudaclick="top_nav_more_1">
//             <p className="moretopic__text">更多话题</p>
//             <span className="moretopic__icon"></span>
//         </div>
//     );
// };

class TopNav extends Component {
    constructor(props) {
        super(props);
        // this._handleLogin = ::this._handleLogin;
        // this._toggleMe = ::this._toggleMe;
        // this._want2Logout = ::this._want2Logout;
        // this._cancelLogout = ::this._cancelLogout;
        // this._handleLogout = ::this._handleLogout;
    }

    // componentWillMount() {
    //     this.props.checkLoginStatus();
    // }

    // componentDidMount() {
    //     const { hasMoreTopic } = this.props;
    //     let headerNavNode = this.refs['header_nav'];

    //     // 用户行为统计
    //     if (hasMoreTopic) {
    //         headerNavNode.dataset['sudaclick'] = "topic_top_nav_1";
    //     }
    //     else {
    //         headerNavNode.dataset['sudaclick'] = "top_nav_1";
    //     }
    // }

    // componentWillUnmount() {
    //     this.refs['header_nav'].dataset['sudaclick'] = "";
    // }

    // _handleLogin() {
    //     const { handleLogin } = this.props;
    //     handleLogin();
    // }

    // _want2Logout() {
    //     const { want2Logout } = this.props;
    //     want2Logout();
    // }

    // _toggleMe() {
    //     const { toggleMe } = this.props;
    //     toggleMe();
    // }

    // _cancelLogout() {
    //     const { cancelLogout } = this.props;
    //     cancelLogout();
    // }

    // _handleLogout() {
    //     const { handleLogout } = this.props;
    //     handleLogout();

    //     // 清除localStorage中的所有话题的评论内容缓存
    //     if (window.localStorage) {
    //         window.localStorage.clear();
    //     }
    // }

    render() {
        // const { hasMoreTopic, userInfo, isWant2Logout, isShowMe } = this.props;
        // let moreTopicHtml = hasMoreTopic ? <MoreTopic history={this.props.history}/> : null;
        // let defaultface = '//i3.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
        // let loginClass = classNames({
        //     'nav__loginbtn': true,
        //     'hide': userInfo.islogin
        // });
        // let portraitClass = classNames({
        //     'nav__portrait': true,
        //     'hide': !userInfo.islogin
        // });
        // let portraitBgClass = classNames({
        //     'nav__portrait-bg': true,
        //     'hide': !(isShowMe || isWant2Logout) || true
        // });
        // let showMeClass = classNames({
        //     'nav__showme': true,
        //     'hide': !isShowMe || true
        // });
        // let confirmLogoutClass = classNames({
        //     'nav__confirm': true,
        //     'hide': !isWant2Logout || true
        // });

        return (
            <header className="layout__header">
                <div ref="header_nav" className="header__nav">
                    <div className="nav__logo"></div>
                </div>
            {/*
                <div ref="header_nav" className="header__nav">
                    <div className={loginClass} onClick={this._handleLogin} data-sudaclick="top_nav_login_1" >登录</div>
                    <div className={portraitClass} 
                         style={{'backgroundImage': 'url(' + (userInfo.userface || defaultface) + ')'}}
                         onClick={this._toggleMe}
                         data-name="showme-toggle"
                         data-sudaclick="top_nav_avatar_1" ></div>
                    <div className={portraitBgClass} data-name="showme-toggle"></div>
                    <div className="nav__logo"></div>
                    { moreTopicHtml }
                </div>
                <div className={showMeClass} data-name="showme-prompts">
                    <div className="showme__bgimg"></div>
                    <div className="showme__textctner">
                        <p className="showme__text">更多功能建设中</p>
                        <p className="showme__text">敬请期待</p>
                    </div>
                    <div className="showme__logout"
                         onClick={this._want2Logout}
                         data-sudaclick="logoout_1" >
                        <p className="logout__text">退出登录</p>
                    </div>
                </div>
                <div className={confirmLogoutClass}>
                    <p className="confirm__question">确定要退出登录吗？</p>
                    <p className="confirm__alert">退出后将不能评论和回复</p>
                    <div className="confirm__cancel" onClick={this._cancelLogout}><p className="cancel__text">取消</p></div>
                    <div className="confirm__exit" 
                         onClick={this._handleLogout}
                         data-sudaclick="logoout_confirm_1" >
                        <p className="exit__text">退出</p>
                    </div>
                </div>
            */}
            </header>
        );
    }
}

TopNav.propTypes = {
    history: PropTypes.object,
    hasMoreTopic: PropTypes.bool,
    isShowMe: PropTypes.bool,
    isWant2Logout: PropTypes.bool,
    userInfo: PropTypes.object,
    checkLoginStatus: PropTypes.func,
    handleLogin: PropTypes.func,
    toggleMe: PropTypes.func,
    want2Logout: PropTypes.func,
    cancelLogout: PropTypes.func,
    handleLogout: PropTypes.func,
};

TopNav.defaultProps = {
    hasMoreTopic: false,
    isShowMe: false,
    isWant2Logout: false,
    userInfo: {
        islogin: 0,
        nick: '',
        portrait_url: '',
        return_url: '',
        uid: '',
        uname: '',
        userface: ''
    },
    checkLoginStatus: () => {},
    handleLogin: () => {},
    toggleMe: () => {},
    want2Logout: () => {},
    cancelLogout: () => {},
    handleLogout: () => {},
};

export default withRouter(TopNav);
