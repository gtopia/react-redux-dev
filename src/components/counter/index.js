import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

class Counter extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const {
            isShowLoading,
            totalCount,
            decrease,
            increaseLater
        } = this.props;
        let loadingClass = classNames({
            'counter__loading': true,
            'hide': !isShowLoading
        });

        return (
            <div className="layout__counter">
                <button className="counter__btn--l" onClick={decrease.bind(this)}>-</button>
                <span className="counter__total">{totalCount}</span>
                <button className="counter__btn--r" onClick={increaseLater.bind(this)}>+</button>
                <div className={loadingClass}></div>
            </div>
        );
    }
}

Counter.propTypes = {
    history: PropTypes.object,
    isShowLoading: PropTypes.bool,
    totalCount: PropTypes.number,
    decrease: PropTypes.func,
    increaseLater: PropTypes.func
};

export default withRouter(Counter);
