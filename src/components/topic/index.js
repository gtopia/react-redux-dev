/**
 * Author: zhiyou
 * Date: 2017/05/16
 * Description: 话题卡片组件。
 */
import './index.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import reqObj from '../../static/util/request.js';
import lazyloadPic from '../../static/util/lazyloadPic.js';

class Topic extends Component {
    constructor(props) {
        super(props);
        this.apiurl = 'http://xiaoyang7.topic.sina.cn/api/news/topic_list';
        this.state =  {
            topicData: [
            ],
            requesting: false
        };
    }

    componentWillMount() {
        this._getData({
            url: this.apiurl,
        });

        $(window).on('scroll', this._loadMore.bind(this, this.apiurl));
    }

    componentDidUpdate() {
        lazyloadPic.init($('.layout__topic'), '.topic__container');
    }

    _getData(opt) {
        let _this = this;

        _this.state.requesting = true;

        let reqCb = reqObj.request({
            url: opt.url,
            data: opt.data || {},
            type: 'GET',
            dataType: 'jsonp',
            timeout: 3000
        });

        reqCb.complete = function() {
            _this.state.requesting = false;
        };

        reqCb.success = function(res) {
            // debugger;
            if (res && res.result && !res.result.status.code && res.result.data.length) {
                _this.setState({'topicData': _this.state.topicData.concat(res.result.data)});
            }
        };
    }

    _loadMore(apiurl) {
        let _this = this;
        let bottomPos = $(window).scrollTop() + window.innerHeight;
        let pageHeight = $('main').offset().top + $('main').height();

        if (!_this.state.requesting && (pageHeight-bottomPos < 10)) {
            let latestTopic = _this.state.topicData[_this.state.topicData.length-1];

            _this._getData({
                url: apiurl,
                data: {
                    id: latestTopic.id,
                    utime: latestTopic.utime,
                    number: 10,
                    offset: _this.state.topicData.length
                }
            });
        }
    }

    render() {
        let topicItems = this.state.topicData.map((item) => {
            if (parseInt(item.attend) >= 10000) {
                item.attend = (parseInt(item.attend)/10000).toFixed(1) + '万';
            }

            return (
                <Link to={`${item.id}`} key={item.id}>
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
            <main className="layout__topic">{topicItems}</main>
        );
    }
}

export default Topic;
