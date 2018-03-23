import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

class Counter extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state);
    }

    render() {
        let loadingClass = classNames({
            'counter__loading': true,
            'hide': false
        });

        return (
            <div className="layout__counter">
                <button>-</button>
                <span>{0}</span>
                <button>+</button>
                <div className={loadingClass}></div>
            </div>
        );
    }
}

Counter.propTypes = {
    history: PropTypes.object,

};

export default withRouter(Counter);
