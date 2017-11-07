/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: APP容器，包含导航条和子页面。
 * Modify: zhiyou@2017/10/12 添加底部菜单栏。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TopNav from '../../components/topNav';
import BottomNav from '../../components/bottomNav';
import * as AppActions from '../../actions/app';
import Browser from '../../static/util/browser';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.appActions.checkLoginStatus();
    }

    componentDidMount() {
        // 检查导航条状态
        $('.layout__app').on('touchstart', this._checkStyle.bind(this));
    }

    _checkStyle(e) {
        var $target = $(e.target);

        if (this.props.appState.isShowMe && 
            !( $target.attr('data-name')=='showme-prompts' || 
               $target.attr('data-name')=='showme-toggle'  || 
               $target.parents('[data-name="showme-prompts"]').length
            )) {
            this.props.appActions.hideShowMePrompts();
        }
    }

    render() {
        const { 
            hasMoreTopic, 
            userInfo, 
            isWant2Logout, 
            isShowMe,
            activeMenu,
        } = this.props.appState;
        const { 
            handleLogin,
            want2Logout, 
            toggleMe, 
            cancelLogout, 
            handleLogout, 
            checkLoginStatus,
            activateMenu,
        } = this.props.appActions;

        if (Browser.SINANEWS || Browser.WX || Browser.WB) {
            return (
                <section className="layout__app" onClick={this._checkStyle.bind(this)}>
                    { this.props.children }
                    <BottomNav
                        activeMenu={activeMenu}
                        activateMenu={activateMenu}
                    />
                </section>
            );
        }
        else {
            return (
                <section className="layout__app" onClick={this._checkStyle.bind(this)}>
                    <TopNav
                        hasMoreTopic={hasMoreTopic}
                        userInfo={userInfo}
                        isShowMe={isShowMe}
                        isWant2Logout={isWant2Logout}
                        checkLoginStatus={checkLoginStatus}
                        handleLogin={handleLogin}
                        toggleMe={toggleMe}
                        want2Logout={want2Logout}
                        cancelLogout={cancelLogout}
                        handleLogout={handleLogout}
                    />
                    { this.props.children }
                    <BottomNav
                        activeMenu={activeMenu}
                        activateMenu={activateMenu}
                    />
                </section>
            );
        }
    }
}

App.propTypes = {
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
)(App));
