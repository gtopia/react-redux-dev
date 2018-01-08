/**
 * Author: zhiyou
 * Date: 2017/10/13
 * Description: 消息页面。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import Share from '../../components/share';
import ShareWarper from '../../components/share/warper';
import CardArticle from '../../components/cardArticle';
import BodyArticle from '../../components/cardArticle/body';
import CardQna from '../../components/cardQna';
import BodyQna from '../../components/cardQna/body';
import CardVote from '../../components/cardVote';
import CardSurvey from '../../components/cardSurvey';
import BackTop from '../../components/backTop';
import * as AppActions from '../../actions/app';
import * as ShareActions from '../../actions/share'; 
import * as MsgActions from '../../actions/message';
import reqObj from '../../static/util/request.js';
import wxShare from '../../static/util/wxShareCustom.js';
import throttle from '../../static/util/throttle.js';
import apis from '../../constants/apis.js';
import { LOGO_SHARE } from '../../constants/app.js';

// 上次读到这里
let LastReadHere = () => {
    return (
        <div className="msg__lastreadhere">您上次看到这里了</div>
    );
};

class Message extends Component {
    constructor(props) {
        super(props);

        this.conf = {
            'uid': '',
            'lastCardInfo': {
                'ctime': '',    // 卡片创建时间
                'tid': '',      // 话题ID
                'cid': '',      // 卡片ID
                'type': 0,      // 卡片类型
                'offset': 20    // 从第一条开始查询，index从0开始
            },
            'lastReadPos': 0,
            'pageSize': 20
        };

        this.state = {
            'topicCount': null,
            'isGetAllCards': false,
            'requesting': false
        };
    }

    componentWillMount() {
        window.document.title = "我的消息 - 全民话题";

        wxShare.init({
            url: 'http://topic.sina.cn',  //分享链接
            title: '全民话题，用不同视角发现新闻', //分享标题
            content: 'http://topic.sina.cn', //分享描述（分享朋友时会显示）
            pic: LOGO_SHARE //分享图片路径
        });

        this.props.appActions.checkLoginStatus();
    }

    componentDidMount() {
        var totalHeight = $('.layout__app').height() || 667;
        var headerHeight = $('.layout__header').height() || 0;
        var menuHeight = $('.layout__menu').height() || 0;

        $('.layout__msg').css({
            'min-height': totalHeight - headerHeight - menuHeight*2 + 'px'
        });
    }

    componentWillReceiveProps(nextProps) {
        let _this = this;
        let uInfo = nextProps.appState.userInfo;

        if (uInfo.uid && uInfo.uid!=this.conf.uid) {
            _this.conf.uid = uInfo.uid;

            // 获取关注的话题数
            _this._getUserTopics(_this.conf.uid);

            // 获取关注的所有话题包含的卡片
            _this._getCardsList(_this.conf.uid);

            $(window).on('scroll', throttle({
                'fn': _this._loadMore,
                'context': _this,
                'delay': 300,
                'mustRunDelay': null
            }));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextProps.shareStateP) === JSON.stringify(this.props.shareStateP) &&
            JSON.stringify(nextProps.msgState) === JSON.stringify(this.props.msgState) &&
            JSON.stringify(nextProps.appState) === JSON.stringify(this.props.appState) &&
            JSON.stringify(nextState) === JSON.stringify(this.state)
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    componentWillUnmount() {
        this.props.msgActions.clearData();
    }

    _getUserTopics(uid) {
        var _this = this;
        var params = {
            'option': {
                url: apis.MY_TOPIC_SUM,
                data: {
                    'uid': uid || ''
                },
                type: 'GET',
                timeout: 10000
            },
            'successCb': function(res) {
                var data = res.result;

                if (data && data.status && data.status.code===0 && data.data) {
                    _this.setState({
                        'topicCount': data.data.count || 0
                    });
                }
            }
        };

        reqObj.request(params.option, params.successCb);
    }

    _getCardsList(uid, lastCardPara) {
        var _this = this;

        var reqPara = {
            'uid': uid || '',
            'num': _this.conf.pageSize || 20
        };

        if (lastCardPara) {
            Object.assign(reqPara, lastCardPara);
        }

        var params = {
            'option': {
                url: apis.MY_CARD_LIST,
                data: reqPara,
                type: 'GET',
                timeout: 10000
            },
            'successCb': function(res) {
                var data = res.result;

                if (data && data.status && data.status.code===0 && data.data) {
                    var cardsCount = data.data.length;

                    if (!cardsCount || cardsCount<_this.conf.pageSize) {
                        _this.setState({
                            'isGetAllCards': true
                        });
                    }

                    if (cardsCount) {
                        _this.props.msgActions.saveCards(data.data);
                        
                        // 获取并保存上拉加载更多时要传的参数
                        var lastCard = data.data[cardsCount - 1];
                        _this.conf.lastCardInfo = {
                            'ctime': lastCard.ctime,
                            'tid': lastCard.tid,
                            'cid': lastCard.cid,
                            'type': lastCard.type,
                            'offset': _this.props.msgState.cardsList.length
                        };
                    }
                }
            },
            'completeCb': function() {
                setTimeout(function() {
                    _this.setState({
                        'requesting': false
                    });
                }, 60);
            }
        };

        _this.setState({
            'requesting': true
        });
        reqObj.request(params.option, params.successCb, null, params.completeCb);
    }

    _loadMore() {
        let $container = $('.layout__msg');
        if (!$container.length || this.state.isGetAllCards || this.state.requesting) {
            return;
        }

        let bottomPos = $(window).scrollTop() + window.innerHeight;
        let pageHeight = $container.offset().top + $container.height();
        let loadingHeight = $('.msg__loading').height();

        if (pageHeight-bottomPos-loadingHeight < 10) {
            // SUDA PV 统计
            let sudaUrl = window.location.href;
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, sudaUrl + '?loadmore=1');

            // 记录上次读到的位置
            this.conf.lastReadPos = this.props.msgState.cardsList.length;

            // 加载新数据
            this._getCardsList(this.conf.uid, this.conf.lastCardInfo);
        }
    }

    render() {
        let {
            userInfo
        } = this.props.appState;
        let {
            handleLogin
        } = this.props.appActions;
        let emptyClass = classNames({
            'hide': this.state.topicCount !== 0
        });
        let cardsListClass = classNames({
            'hide': this.state.topicCount === 0
        });

        const {
            shareState,
            shareWeiboUrl,
            warpState,
            safariState,
            wxState,
            shareData
        } = this.props.shareStateP;
        const {
            hideShare,
            showShare,
            initWechat,
            hideWXShare,
            resetShareState
        } = this.props.shareActions;

        const {
            cardsList,
            articleData,
            tipsText,
            tipsStatus,
            hideResultState1,
            qnaData,
            bodyQnaState
        } = this.props.msgState;

        const {
            praiseFunc,
            resetBodyArticleState,
            voteFunc,
            suverySubmitFunc,
            checkAllArticle,
            setQnaData,
            showBodyQna,
            closeBodyQna,
            resetBodyQnaState
        } = this.props.msgActions;

        let tipsState = classNames({
            'submit__status': tipsStatus,
            'hide': !tipsStatus
        });

        let cardsListView = this.props.msgState.cardsList.map((item, i) => {
            if (!item){
                return;
            }

            let lastReadHereHTML = null;
            if (this.conf.lastReadPos>0 && i==this.conf.lastReadPos && !this.state.isGetAllCards) {
                lastReadHereHTML = (<LastReadHere />);
            }

            switch (item.type) {
                case 0: {
                    return (
                        <div data-sudaclick="message_card" key={item.type+'_'+item.cid+'_'+i}>
                            <CardArticle
                                showShare={showShare}
                                articleInfor={item}
                                praiseFunc={praiseFunc}
                                userInfo={userInfo}
                                isShow={true}
                                index={i}
                                topicTitle={item.tname}
                                topicAttend={item.attend}
                                topicId={item.tid}
                                checkAllArticle={checkAllArticle}
                                isShowSource={true}
                            />
                            { lastReadHereHTML }
                        </div>
                    );
                }
                case 1: {
                    let voteOther = {
                        cid: item.cid,
                        type: item.type,
                        etime: item.etime,
                        title: item.title,
                        share: item.share,
                        isvote: item.isvote,
                    };

                    return (
                        <div data-sudaclick="message_card" key={item.type+'_'+item.cid+'_'+i}>
                            <CardVote
                                showShare={showShare}
                                voteOther={voteOther}
                                voteInfor={item.content[0]}
                                userInfo={userInfo}
                                voteFunc={voteFunc}
                                isShow={true}
                                topicTitle={item.tname}
                                topicAttend={item.attend}
                                topicId={item.tid}
                                isShowSource={true}
                            />
                            { lastReadHereHTML }
                        </div>
                    );
                }
                case 2: {
                    let suveryOther = {
                        cid: item.cid,
                        type: item.type,
                        etime: item.etime,
                        title: item.title,
                        share: item.share,
                        isvote: item.isvote,
                    };

                    return (
                        <div data-sudaclick="message_card" key={item.type+'_'+item.cid+'_'+i}>
                            <CardSurvey
                                showShare={showShare}
                                suveryOther={suveryOther}
                                suveryInfor={item.content}
                                userInfo={userInfo}
                                hideResultState1={hideResultState1}
                                suverySubmitFunc={suverySubmitFunc}
                                isShow={true}
                                topicTitle={item.tname}
                                topicAttend={item.attend}
                                topicId={item.tid}
                                isShowSource={true}
                            />
                            { lastReadHereHTML }
                        </div>
                    );
                }
                case 3: {   // 问答卡片
                    let qnaInfo = {
                        cid: item.cid,
                        type: item.type,
                        title: item.title,
                        share: item.share,
                        count: item.count,
                        answerer: item.answer,
                    };

                    return (
                        <div data-sudaclick="message_card_qanda" key={item.type+'_'+item.cid+'_'+i}>
                            <CardQna 
                                isShow={true}
                                showShare={showShare}
                                userInfo={userInfo}
                                cardInfo={qnaInfo}
                                topicTitle={item.tname}
                                topicAttend={item.attend}
                                topicId={item.tid}
                                setDetailData={setQnaData}
                                showBody={showBodyQna}
                                isShowSource={true}
                            />
                            { lastReadHereHTML }
                        </div>
                    );
                }
                default: {
                    break;
                }
            }
        });

        let loadingClass = classNames({
            'msg__loading': true,
            'hide': this.state.isGetAllCards
        });

        if (userInfo.islogin) {
            return (
                <div className="layout__msg">
                    <img className="hide" width="400px" height="400px" src={LOGO_SHARE} />
                    <div className={cardsListClass}>
                        <Share 
                            shareState={shareState} 
                            resetShareState={resetShareState} 
                            closeShare={hideShare} 
                            shareWeiboUrl={shareWeiboUrl}
                            wechatShare={initWechat} 
                            pengyouquanShare={initWechat}
                            shareData={shareData} />
                        <ShareWarper 
                            shareWarperState={warpState} 
                            safariState={safariState} 
                            wxState={wxState} 
                            hideWXShare={hideWXShare} />
                        {cardsListView}

                        <BodyArticle 
                            showShare={showShare}
                            articleInfor={cardsList[articleData.index]}
                            praiseFunc={praiseFunc}
                            userInfo={userInfo}
                            bodyArticleState={articleData.bodyState}
                            topicId={articleData.topicId}
                            topicTitle={articleData.topicTitle}
                            topicAttend={articleData.topicAttend}
                            resetBodyArticleState={resetBodyArticleState}
                            closedAllArticle={checkAllArticle} />

                        <BodyQna 
                            showShare={showShare}
                            bodyData={qnaData}
                            bodyState={bodyQnaState}
                            closeBody={closeBodyQna}
                            resetBodyState={resetBodyQnaState} />

                        <div className={tipsState}>{tipsText}</div>
                        <BackTop />
                        <div className={loadingClass}></div>
                    </div>

                    <div className={emptyClass}>
                        <div className="msg__bgimg"></div>
                        <div className="msg__textctner">
                            <p className="text">当你关注话题后<br/>这里会显示你关注的话题动态</p>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="layout__msg">
                    <div className="msg__notlogin">
                        <p className="prompt">当你登陆后<br/>这里会显示你关注的话题动态</p>
                        <div className="login-btn" onClick={handleLogin.bind(this)} data-sudaclick="message_login">登 录</div>
                    </div>
                </div>
            );
        }
    }
}

Message.propTypes = {
    history: PropTypes.object,
    appState: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    shareStateP: PropTypes.object.isRequired,
    shareActions: PropTypes.object.isRequired,
    msgState: PropTypes.object.isRequired,   
    msgActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        appState: state.app.toJS(),
        shareStateP: state.share.toJS(),
        msgState: state.message.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(AppActions, dispatch),
        shareActions: bindActionCreators(ShareActions, dispatch),
        msgActions: bindActionCreators(MsgActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Message));
