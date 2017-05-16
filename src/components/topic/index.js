/**
 * Author: zhiyou
 * Date: 2017/05/16
 * Description: 话题卡片组件。
 */
import './index.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
// import reqObj from '../../static/util/request.js';

class Topic extends Component {
    constructor(props) {
        super(props);
        this.topicData = [];
    }

    componentWillMount() {
        this.topicData = [
            {
                "id": "1",
                "tname": "topic1",
                "digest": "老太摆摊打气球判三年",
                "url": "http://k.sinaimg.cn/n/blog/0ef13950/20170512/11.jpg/w710h340z1l1t1db0.jpg",
                "attend": "10001",
                "utime": "1493976709"
            },
            {
                "id": "2",
                "tname": "topic2",
                "digest": "如果需要换行就换标题太长就换行但是也不能超过两行",
                "url": "http://k.sinaimg.cn/n/blog/transform/20170515/J3lT-fyfeutp9876975.jpg/w710h340z1l1t1c76.jpg",
                "attend": "19000",
                "utime": "1493976701"
            },
        ];
    }

    render() {
        const {  } = this.props;
        let topicClass = classNames({
            'hide': !(true)
        });

        let topicItems = this.topicData.map((item) => {
            if (parseInt(item.attend) >= 10000) {
                item.attend = (parseInt(item.attend)/10000).toFixed(1) + '万';
            }

            return (
                <Link to={item.id} key={item.id}>
                    <div className="topic__container"
                         style={{'backgroundImage': 'url(' + item.url + ')'}}>
                        <div className="topic__people">
                            <p className="people__num">{item.attend}</p>
                            <p className="people__desc">人参与</p>
                        </div>
                        <p className="topic__title"># {item.digest} #</p>
                    </div>
                </Link>
            );
        });

        return (
            <main className={topicClass}>{topicItems}</main>
        );
    }
}

Topic.propTypes = {
    isShowFav: PropTypes.bool,
    isShowFavGuide: PropTypes.bool,
    showFav: PropTypes.func,
    closeFav: PropTypes.func,
};

Topic.defaultProps = {
    isShowFav: false,
    isShowFavGuide: false,
    showFav: () => {},
    closeFav: () => {},
};

export default Topic;
