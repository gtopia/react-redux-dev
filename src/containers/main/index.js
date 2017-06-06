/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 首页容器。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navigation from '../../components/navigation';
import Topic from '../../components/topic';
import Favorite from '../../components/favorite';
import BackTop from '../../components/backTop';
import * as MainActions from '../../actions/main';
import classNames from 'classnames';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'loading': true,
        };
    }

    _checkStyle(e) {
        var $target = $(e.target);

        if (this.props.mainState.isShowMe && !($target.attr('data-name')=='showme-prompts' || $target.parents('[data-name="showme-prompts"]').length)) {
            this.props.mainActions.hideShowMePrompts();
        }
    }

    _hideLoading() {
        this.state.loading = false;
    }

    render() {
        const { 
            hasMoreTopic, 
            userInfo, 
            isWant2Logout, 
            isShowMe,
            isShowFav,
            isShowFavGuide,
        } = this.props.mainState;
        const { 
            handleLogin,
            want2Logout, 
            showMe, 
            cancelLogout, 
            handleLogout, 
            checkLoginStatus,
            showFav,
            closeFav,
            showFavGuide,
            closeFavGuide,
        } = this.props.mainActions;
        let statusLoadingClass = classNames({
            'loading': true,
            'hide': !this.state.loading
        });

        return ( 
            <section className="layout__section" onClick={this._checkStyle.bind(this)}>
                <Navigation 
                    hasMoreTopic={hasMoreTopic}
                    userInfo={userInfo} 
                    isShowMe={isShowMe} 
                    isWant2Logout={isWant2Logout} 
                    checkLoginStatus={checkLoginStatus} 
                    handleLogin={handleLogin} 
                    showMe={showMe}
                    want2Logout={want2Logout}
                    cancelLogout={cancelLogout}
                    handleLogout={handleLogout}
                /> 
                <div className={statusLoadingClass}></div>
                <Topic hideLoading={this._hideLoading.bind(this)} />
                <Favorite 
                    isShowFav={isShowFav} 
                    isShowFavGuide={isShowFavGuide} 
                    showFav={showFav} 
                    closeFav={closeFav} 
                    showFavGuide={showFavGuide} 
                    closeFavGuide={closeFavGuide} 
                />
                <BackTop />
            </section>
        );
    }
}

Main.propTypes = {
    mainState: PropTypes.object.isRequired,
    mainActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mainState: state.main.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mainActions: bindActionCreators(MainActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
