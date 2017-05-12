import './index.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navigation from '../../components/navigation';
import Favorite from '../../components/favorite';
import * as MainActions from '../../actions/main';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    _checkStyle(e) {
        var $target = $(e.target);

        if (this.props.mainState.isShowMe && !($target.attr('data-name')=='showme-prompts' || $target.parents('[data-name="showme-prompts"]').length)) {
            this.props.mainActions.hideShowMePrompts();
        }
    }

    render() {
        const { 
            hasMoreTopic, 
            userInfo, 
            isWant2Logout, 
            isShowMe,
            isShowAddFav,
            isShowGuideFav,
        } = this.props.mainState;
        const { 
            handleLogin,
            want2Logout, 
            showMe, 
            cancelLogout, 
            handleLogout, 
            checkLoginStatus,
            closeFav,
        } = this.props.mainActions;

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
                <main>
                    <div style={{width:'100%',height:'200px'}}>Card1</div> 
                    <div style={{width:'100%',height:'200px'}}>Card2</div> 
                    <div style={{width:'100%',height:'200px'}}>Card3</div> 
                    <div style={{width:'100%',height:'200px'}}>Card4</div> 
                    <div style={{width:'100%',height:'200px'}}>Card5</div> 
                </main>
                <Favorite isShowAddFav={isShowAddFav} isShowGuideFav={isShowGuideFav} closeFav={closeFav} />
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
