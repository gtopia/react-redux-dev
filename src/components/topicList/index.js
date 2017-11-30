/**
 * Author: zhiyou
 * Date: 2017/05/16
 * Description: 话题卡片组件。
 * Modify: jinping3 参与人数限制及样式处理。
 *         zhiyou@2017/09/14 修改加载更多时loading显示逻辑。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import reqObj from '../../static/util/request.js';
import lazyloadPic from '../../static/util/lazyloadPic.js';
import throttle from '../../static/util/throttle.js';
import classNames from 'classnames';
import apis from '../../constants/apis.js';

class TopicList extends Component {
    constructor(props) {
        super(props);
        this.PAGESIZE = 10;     // 每次上拉加载条数
        this.state =  {
            topicData: [],
            requesting: false,
            isGetAll: false
        };
    }

    componentWillMount() {
        this._getData({
            url: apis.TOPIC_LIST,
        });

        $(window).on('scroll', throttle({
            'fn': this._loadMore.bind(this, apis.TOPIC_LIST),
            'context': this,
            'delay': 300,
            'mustRunDelay': null
        }));
    }

    componentDidUpdate() {
        lazyloadPic.init($('.layout__topic'), '.topic__container');
    }

    _getData(opt) {
        let _this = this;

        _this.setState({
            'requesting': true,
        });

        let getTopics = {
            'option': {
                url: opt.url,
                data: opt.data || {},
                type: 'GET',
                dataType: 'jsonp',
                timeout: 5000
            },
            'successCb': function(res) {
                if (res && res.result && !res.result.status.code && res.result.data && res.result.data.length) {
                    if (res.result.data.length < _this.PAGESIZE) {
                        _this.setState({
                            'isGetAll': true
                        });
                    }

                    _this.setState({
                        'topicData': _this.state.topicData.concat(res.result.data)
                    });
                }
            },
            'completeCb': function() {
                _this.setState({
                    'requesting': false,
                });
            }
        };

        reqObj.request(getTopics.option, getTopics.successCb, null, getTopics.completeCb);
    }

    _loadMore(url) {
        let $container = $('main');
        if (!$container.length || this.state.requesting || this.state.isGetAll) {
            return;
        }

        let _this = this;
        let bottomPos = $(window).scrollTop() + window.innerHeight;
        let pageHeight = $container.offset().top + $container.height();
        let loadingHeight = $('.topic__loading').height();

        if (pageHeight-bottomPos-loadingHeight < 10) {
            // SUDA PV 统计
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.href + '?loadmore=1');

            let latestTopic = _this.state.topicData[_this.state.topicData.length-1];
            let reqPara = {
                id: parseInt(latestTopic.id),
                num: _this.PAGESIZE,
                utime: latestTopic.utime,
                offset: _this.state.topicData.length
            };

            _this._getData({
                url: url,
                data: reqPara
            });
        }
    }

    _gotoPage(path) {
        var fullPath = path + window.location.search;
        this.props.history.push(fullPath);

        // SUDA PV统计
        window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.host + '/' + fullPath);
    }

    render() {
        let statusLoadingClass = classNames({
            'topic__loading': true,
            'hide': this.state.isGetAll || (!this.state.requesting && !this.state.topicData.length)
        });
        let topicItems = this.state.topicData.map((item, index) => {
            if (parseInt(item.attend) >= 100000000) {
                item.attend = parseFloat((parseInt(item.attend)/100000000).toFixed(1)) + '亿';
            }

            if (parseInt(item.attend) >= 10000) {
                item.attend = parseFloat((parseInt(item.attend)/10000).toFixed(1)) + '万';
            }

            // 压缩图片
            let resizeImgUrl = '//s.img.mix.sina.com.cn/api/auto/resize?size=400_0&img=' + encodeURIComponent(item.url);
            let presenterClass = classNames({
                'presenter': true,
                'hide': !item.hoster
            });

            return (
                <div onClick={this._gotoPage.bind(this, 'ht'+`${item.id}`)} key={index} data-sudaclick="card_list_1">
                    <div className="topic__container" data-imgurl={resizeImgUrl}>
                        <div className="topic__title">
                            <div className="title">
                                <h2 className="name"># {item.tname} #</h2>
                                <p className={presenterClass}>{item.hoster}</p>
                            </div>
                        </div>
                        <div className="topic__people">
                            <p className="num">{item.attend}</p>
                            <p className="desc">人参与</p>
                        </div>
                    </div>
                </div>
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

TopicList.propTypes = {
    history: PropTypes.object,
};

export default withRouter(TopicList);
