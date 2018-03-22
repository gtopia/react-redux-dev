import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="layout__app">
                { this.props.children }
            </main>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

export default withRouter(App);
