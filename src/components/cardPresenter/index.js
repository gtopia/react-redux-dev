 /* 
 * Author: zhiyou
 * Date: 2017/11/21
 * Description: 主持人卡片
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MAIN_URL, DEFAULT_FACE } from '../../constants/app';
import classNames from 'classnames';

class CardPresenter extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(nextProps.cardInfo) === JSON.stringify(this.props.cardInfo) &&
            nextProps.isShow === this.props.isShow &&
            nextProps.isShowSource === this.props.isShowSource &&
            nextProps.topicTitle === this.props.topicTitle &&
            nextProps.topicId === this.props.topicId
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

    render () {
        const { isShow, cardInfo, isShowSource, topicTitle, topicId } = this.props;
        let cardClass = classNames({
            'layout__presenter': true,
            'hide': !isShow
        });
        let cardSourceClass = classNames({
            'presenter__source': true,
            'hide': !isShowSource
        });

        return(
            <section className={cardClass}>
                <div className={cardSourceClass} data-sudaclick="message_card_topic" onClick={this._gotoTopicDetailPage.bind(this, topicId)}>
                    来自话题：#{topicTitle}#
                </div>
                <div className="presenter__info">
                    <img className="portrait" src={cardInfo.hostImg || DEFAULT_FACE} alt="头像" />
                    <div className="intro">
                        <div className="name">{cardInfo.hostName}</div>
                        <div className="title">话题主持人</div>
                    </div>
                </div>
                <p className="presenter__topic-digest">{cardInfo.profile}</p>
            </section>
        );
    }
}

CardPresenter.propTypes = {
    history: PropTypes.object,
    isShow: PropTypes.bool,
    cardInfo: PropTypes.object,
    isShowSource: PropTypes.bool,
    topicTitle: PropTypes.string,
    topicId: PropTypes.string
};

CardPresenter.defaultProps = {
    isShow: false,
    cardInfo: {},
    isShowSource: false,
    topicTitle: '',
    topicId:''
}; 

export default withRouter(CardPresenter);
