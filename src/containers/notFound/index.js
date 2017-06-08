/**
 * Author: zhiyou
 * Date: 2017/06/02
 * Description: 404页面。
 */
import './index.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { MAIN_URL } from '../../constants/app';
import wxShare from '../../static/util/wxShareCustom.js';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        wxShare.init({
            url: 'http://topic.sina.cn/',  //分享链接
            title: '全民话题 - 用不同视角发现新闻', //分享标题
            content: '', //分享描述（分享朋友时会显示）
            pic: 'http://simg.sinajs.cn/products/news/items/2017/top_topics/img/logo-share.png' //分享图片路径
        });
    }

    _handleBack() {
        if (!window.history.length || window.document.referrer == "") {
            window.location = MAIN_URL;
        }
        else {
            // window.location.href = window.document.referrer;
            window.history.back();
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
