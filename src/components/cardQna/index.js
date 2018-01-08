 /* 
 * Author: zhiyou
 * Date: 2017/11/22
 * Description: 问答卡片
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MAIN_URL } from '../../constants/app';
import classNames from 'classnames';
import reqObj from '../../static/util/request.js';
import apis from '../../constants/apis.js';

class CardQna extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'detailData': {}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextProps.cardInfo) === JSON.stringify(this.props.cardInfo) &&
            nextProps.userInfo.uid === this.props.userInfo.uid &&
            nextProps.isShow === this.props.isShow &&
            nextProps.topicTitle === this.props.topicTitle &&
            nextProps.topicAttend === this.props.topicAttend &&
            nextProps.topicId === this.props.topicId &&
            nextProps.isShowSource === this.props.isShowSource &&
            JSON.stringify(nextState.detailData) === JSON.stringify(this.state.detailData)
            ) {
            return false;
        }
        else {
            return true;
        }
    }

    _gotoTopicDetailPage(topicId) {
        this.props.history.push(MAIN_URL + 'ht' + topicId);
    }

    _getDetailData() {
        var _this = this;
        const { cardInfo, userInfo, setDetailData, showBody } = this.props;

        if (this.state.detailData.cid) {
            setDetailData(Object.assign(this.state.detailData, {
                'answerer': cardInfo.answerer || [],
                'share': cardInfo.share,
                'tname': _this.props.topicTitle,
                'tid': _this.props.topicId,
                'attend': _this.props.topicAttend
            }));
            showBody();
        }
        else {
            var params = {
                'option': {
                    url: apis.CARD_DETAIL,
                    data: {
                        'uid': userInfo.uid || '',
                        'type': 3,
                        'cid': cardInfo.cid
                    },
                    type: 'GET',
                    timeout: 10000
                },
                'successCb': function(res) {
                    var data = res.result;

                    if (data && data.status && data.status.code===0 && data.data) {
                        _this.setState({
                            'detailData': data.data
                        });
                        setDetailData(Object.assign(data.data, {
                            'answerer': cardInfo.answerer || [],
                            'share': cardInfo.share,
                            'tname': _this.props.topicTitle,
                            'tid': _this.props.topicId,
                            'attend': _this.props.topicAttend
                        }));
                        showBody();
                    }
                }
            };

            reqObj.request(params.option, params.successCb);
        }
    }

    render () {
        const { isShow, cardInfo, showShare, topicTitle, topicAttend, topicId, isShowSource } = this.props;
        const shareUrl = cardInfo.share + "?id=" + topicId + "&scid=" + cardInfo.cid + "&type="+ cardInfo.type;
        let cardClass = classNames({
            'layout__qna': true,
            'hide': !isShow
        });
        let cardSourceClass = classNames({
            'qna__source': true,
            'hide': !isShowSource
        });

        return(
            <section className={cardClass}>
                <div className={cardSourceClass} data-sudaclick="message_card_topic" onClick={this._gotoTopicDetailPage.bind(this, topicId)}>
                    来自话题：#{topicTitle}#
                </div>
                <div className="qna__cnter" data-sudaclick="topic_qanda_card" onClick={this._getDetailData.bind(this)}>
                    <div className="icon"></div>
                    <div className="title">{cardInfo.title}</div>
                    <p className="content">
                        {cardInfo.answerer.slice(0, 3).join("、") + "等 "}
                        <span className="num">{cardInfo.count}</span>
                        {" 人回答了该问题"}
                        <a className="checkall">去查看</a>
                    </p>
                </div>
                <div className="card-icon">
                    <a className="card-icon__share"
                        data-sudaclick="topic_qanda_share"
                        data-sharetype="card_qa"
                        data-shareurl={shareUrl}
                        data-sharetitle={cardInfo.title}
                        data-sharetopic={topicTitle}
                        data-shareattend={topicAttend}
                        data-shareanswerer={cardInfo.answerer}
                        onClick={showShare}>
                        <i className="card-icon-i"></i>分享
                    </a>
                </div>
            </section>
        );
    }
}

CardQna.propTypes = {
    history: PropTypes.object,
    showShare: PropTypes.func,
    setDetailData: PropTypes.func,
    showBody: PropTypes.func,
    isShow: PropTypes.bool,
    userInfo: PropTypes.object,
    cardInfo: PropTypes.object,
    topicTitle: PropTypes.string,
    topicAttend: PropTypes.string,
    topicId: PropTypes.string,
    isShowSource: PropTypes.bool
};

CardQna.defaultProps = {
    showShare: () => {},
    setDetailData: () => {},
    showBody: () => {},
    isShow: false,
    userInfo: {
        islogin: 0,
        nick: '',
        portrait_url: '',
        return_url: '',
        uid: '',
        uname: '',
        userface: ''
    },
    cardInfo: {},
    topicTitle: '',
    topicAttend: '',
    topicId:'',
    isShowSource: false
};

export default withRouter(CardQna);
