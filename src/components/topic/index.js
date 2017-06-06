/**
 * Author: zhiyou
 * Date: 2017/05/16
 * Description: 话题卡片组件。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import reqObj from '../../static/util/request.js';
import lazyloadPic from '../../static/util/lazyloadPic.js';
import classNames from 'classnames';

class Topic extends Component {
    constructor(props) {
        super(props);
        this.apiurl = 'http://topic.sina.cn/api/news/topic_list';
        this.state =  {
            topicData: [],
            requesting: false,
        };
    }

    componentWillMount() {
        this._getData({
            url: this.apiurl,
        });

        $(window).on('scroll', this._loadMore.bind(this, this.apiurl));
    }

    componentDidMount() {
        this.props.hideLoading();
    }

    componentDidUpdate() {
        lazyloadPic.init($('.layout__topic'), '.topic__container');
    }

    _getData(opt) {
        let _this = this;

        _this.setState({
            'requesting': true,
        });

        let reqCb = reqObj.request({
            url: opt.url,
            data: opt.data || {},
            type: 'GET',
            dataType: 'jsonp',
            timeout: 3000
        });

        reqCb.complete = function() {
            _this.setState({
                'requesting': false,
            });
        };

        reqCb.success = function(res) {
            if (res && res.result && !res.result.status.code && res.result.data && res.result.data.length) {
                _this.setState({
                    'topicData': _this.state.topicData.concat(res.result.data)
                });
            }
        };
    }

    _loadMore(apiurl) {
        let $container = $('main');
        if (!$container.length) {
            return;
        }

        let _this = this;
        let bottomPos = $(window).scrollTop() + window.innerHeight;
        let pageHeight = $container.offset().top + $container.height();

        if (!_this.state.requesting && (pageHeight-bottomPos < 10)) {
            // SUDA PV 统计
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.href + '?loadmore=1');

            let latestTopic = _this.state.topicData[_this.state.topicData.length-1];
            let reqPara = {
                id: parseInt(latestTopic.id),
                num: 10,
                utime: latestTopic.utime,
                offset: _this.state.topicData.length
            };

            _this._getData({
                url: apiurl,
                data: reqPara
            });
        }
    }

    render() {
        let statusLoadingClass = classNames({
            'topic__loading': true,
            'hide': !this.state.requesting
        });
        let topicItems = this.state.topicData.map((item) => {
            if (parseInt(item.attend) >= 10000) {
                item.attend = (parseInt(item.attend)/10000).toFixed(1) + '万';
            }

            return (
                <Link to={'ht'+`${item.id}`} key={item.id} data-sudaclick="card_list_1">
                    <div className="topic__container" data-imgurl={item.url}>
                        <div className="topic__people">
                            <p className="num">{item.attend}</p>
                            <p className="desc">人参与</p>
                        </div>
                        <div className="topic__title">
                            <p className="text"># {item.digest} #</p>
                        </div>
                    </div>
                </Link>
            );
        });

        return (
            <main className="layout__topic">
                {topicItems}
                <div className={statusLoadingClass}></div>
            </main>
        );
    }
}

Topic.propTypes = {
    hideLoading: PropTypes.func,
};

Topic.defaultProps = {
    hideLoading: () => {},
};

export default Topic;
