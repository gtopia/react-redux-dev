/**
 * Author: zhiyou
 * Date: 2017/06/02
 * Description: 404页面。
 */
import './index.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { MAIN_URL } from '../../constants/app';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    _handleBack() {
        if (window.document.referrer == "") {
            window.location = MAIN_URL;
        }
        else {
            window.location.href = window.document.referrer;
        }
    }

	render() {
		return (
			<div className="layout__notfound">
				<div className="notfound__bg"></div>
                <p className="notfound__prompt">抱歉，该页面不存在</p>
				<p className="notfound__suggest">请检查页面地址输入是否正确</p>
                <div className="notfound__back" onClick={this._handleBack.bind(this)}>
                    <p className="txt">
                        <span className="back__bg"></span>返回上页
                    </p>
                </div>
                <Link to={MAIN_URL} className="notfound__gohome">
                    <p className="txt">回首页</p>
                </Link>
			</div>
		);
	}
}

export default NotFound;
