import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as AppActions from '../../actions/app';
import Browser from '../../static/util/browser';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'location': {}
        };
    }

    componentWillMount() {
        this.setState({
            'location': Object.assign({}, this.props.history.location)
        });
    }

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(nextProps.appState) === JSON.stringify(this.props.appState) &&
            JSON.stringify(nextProps.history.location) === JSON.stringify(this.state.location)) {
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        const { 
            hasMoreTopic, 
            userInfo, 
            isWant2Logout, 
            isShowMe
        } = this.props.appState;
        const { 
            handleLogin,
            want2Logout, 
            toggleMe, 
            cancelLogout, 
            handleLogout, 
            checkLoginStatus
        } = this.props.appActions;

        return (
            <main className="layout__app">
                { this.props.children }
            </main>
        );
    }
}

App.propTypes = {
    history: PropTypes.object,
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
