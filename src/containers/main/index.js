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
import { withRouter } from 'react-router-dom';
import TopicList from '../../components/topicList';
import Favorite from '../../components/favorite';
import BackTop from '../../components/backTop';
import * as MainActions from '../../actions/main';
// import classNames from 'classnames';
import wxShare from '../../static/util/wxShareCustom.js';
import * as AppActions from '../../actions/app';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        window.document.title = "全民话题 - 用不同视角发现新闻";
        
        // 刷新或跳转页面时，a.gif包含url信息
        // window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.href);

        this.props.appActions.hideMoreTopics();
        wxShare.init({
            url: 'http://topic.sina.cn/',  //分享链接
            title: '全民话题，用不同视角发现新闻', //分享标题
            content: 'http://topic.sina.cn', //分享描述（分享朋友时会显示）
            pic: 'http://simg.sinajs.cn/products/news/items/2017/top_topics/img/logo-share.png' //分享图片路径
        });
    }

    componentDidMount() {
        $(window).scrollTop(0);
    }

    render() {
        const { 
            isShowFav,
            isShowFavGuide,
        } = this.props.mainState;
        const { 
            showFav,
            closeFav,
            showFavGuide,
            closeFavGuide,
        } = this.props.mainActions;

        return ( 
            <section className="layout__main" >
                <TopicList/>
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
    mainActions: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mainState: state.main.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mainActions: bindActionCreators(MainActions, dispatch),
        appActions: bindActionCreators(AppActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Main));
