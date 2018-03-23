import './index.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { MAIN_URL } from '../../constants/app';
import PropTypes from 'prop-types';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    _gotoPrev() {
        if (!window.history.length || window.document.referrer == "") {
            this.props.history.push(MAIN_URL + window.location.search);
        }
        else {
            this.props.history.goBack();
        }
    }

    _gotoHome() {
        this.props.history.push(MAIN_URL + window.location.search);
    }

	render() {
		return (
			<div className="layout__notfound">
				<div className="notfound__bg"></div>
                <p className="notfound__prompt">抱歉，该页面不存在</p>
				<p className="notfound__suggest">请检查页面地址输入是否正确</p>
                <div className="notfound__back" onClick={this._gotoPrev.bind(this)}>
                    <p className="txt">
                        <span className="back__bg"></span>返回上页
                    </p>
                </div>
                <div className="notfound__gohome" onClick={this._gotoHome.bind(this)}>
                    <p className="txt">回首页</p>
                </div>
			</div>
		);
	}
}

NotFound.propTypes = {
    history: PropTypes.object
};

export default withRouter(NotFound);
