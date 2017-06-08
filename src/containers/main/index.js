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
import Topic from '../../components/topic';
import Favorite from '../../components/favorite';
import BackTop from '../../components/backTop';
import * as MainActions from '../../actions/main';
// import classNames from 'classnames';
import wxShare from '../../static/util/wxShareCustom.js';
import * as AppActions from '../../actions/app';

class Main extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     'loading': false,
        // };
    }

    componentWillMount() {
        this.props.appActions.hideMoreTopics();
        wxShare.init({
            url: 'http://topic.sina.cn/',  //分享链接
            title: '全民话题 - 用不同视角发现新闻', //分享标题
            content: '', //分享描述（分享朋友时会显示）
            pic: 'http://simg.sinajs.cn/products/news/items/2017/top_topics/img/logo-share.png' //分享图片路径
        });
    }

    componentDidMount() {
        $(window).scrollTop(0);
    }
    
    // _hideLoading() {
    //     this.state.loading = false;
    // }

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
                <Topic/>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
