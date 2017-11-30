/**
 * Author: zhiyou
 * Date: 2017/06/02
 * Description: 404页面。
 */
import './index.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { MAIN_URL, LOGO_SHARE } from '../../constants/app';
import wxShare from '../../static/util/wxShareCustom.js';
import PropTypes from 'prop-types';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        wxShare.init({
            url: '//topic.sina.cn',  //分享链接
            title: '全民话题，用不同视角发现新闻', //分享标题
            content: 'http://topic.sina.cn', //分享描述（分享朋友时会显示）
            pic: LOGO_SHARE //分享图片路径
        });
    }

    _gotoPrev() {
        if (!window.history.length || window.document.referrer == "") {
            this.props.history.push(MAIN_URL + window.location.search);

            // SUDA PV统计
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.host);
        }
        else {
            // window.location.href = window.document.referrer;
            // window.history.back();
            this.props.history.goBack();
        }
    }

    _gotoHome() {
        this.props.history.push(MAIN_URL + window.location.search);

        // SUDA PV统计
        window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.host);
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
    history: PropTypes.object,
};

export default withRouter(NotFound);
