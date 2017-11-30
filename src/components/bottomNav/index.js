/**
 * Author: zhiyou
 * Date: 2017/10/12
 * Description: 底部导航组件。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MAIN_URL, MESSAGE_URL, ME_URL } from '../../constants/app';
import classNames from 'classnames';

class BottomNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { history, activateMenu } = this.props;

        switch (history.location.pathname) {
            case '/': {
                activateMenu('topic');
                break;
            }
            case '/me': {
                activateMenu('me');
                break;
            }
            case '/message': {
                activateMenu('message');
                break;
            }
            default: {
                activateMenu('none');
                break;
            }
        }
    }

    _gotoPage(name) {
        let fullPath = '';
        const { activateMenu } = this.props;
        activateMenu(name);

        switch (name) {
            case 'topic': {
                fullPath = MAIN_URL + window.location.search;

                break;
            }
            case 'message': {
                fullPath = MESSAGE_URL + window.location.search;

                break;
            }
            case 'me': {
                fullPath = ME_URL + window.location.search;

                break;
            }
            default: {
                break;
            }
        }

        // SUDA PV统计
        window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, window.location.host + fullPath);

        this.props.history.push(fullPath);
    }

    render() {
        const { activeMenu } = this.props;
        let topicIconClass = classNames({
            'icon__topic': activeMenu !== 'topic',
            'icon__topic--active': activeMenu === 'topic',
        });
        let topicNameClass = classNames({
            'menu__name': activeMenu !== 'topic',
            'menu__name--active': activeMenu === 'topic',
        });

        let msgIconClass = classNames({
            'icon__msg': activeMenu !== 'message',
            'icon__msg--active': activeMenu === 'message',
        });
        let msgNameClass = classNames({
            'menu__name': activeMenu !== 'message',
            'menu__name--active': activeMenu === 'message',
        });

        let meIconClass = classNames({
            'icon__me': activeMenu !== 'me',
            'icon__me--active': activeMenu === 'me',
        });
        let meNameClass = classNames({
            'menu__name': activeMenu !== 'me',
            'menu__name--active': activeMenu === 'me',
        });

        return (
            <div className="layout__menu" data-sudaclick="topic_bottom_nav">
                <div className="item" onClick={this._gotoPage.bind(this, 'topic')}>
                    <div className={topicIconClass}></div>
                    <p className={topicNameClass}>话题</p>
                </div>
                <div className="item" onClick={this._gotoPage.bind(this, 'message')}>
                    <div className={msgIconClass}></div>
                    <p className={msgNameClass}>消息</p>
                </div>
                <div className="item" onClick={this._gotoPage.bind(this, 'me')}>
                    <div className={meIconClass}></div>
                    <p className={meNameClass}>我</p>
                </div>
            </div>
        );
    }
}

BottomNav.propTypes = {
    history: PropTypes.object,
    activeMenu: PropTypes.string,
    activateMenu: PropTypes.func,
};

BottomNav.defaultProps = {
    activeMenu: 'topic',
    activateMenu: () => {},
};

export default withRouter(BottomNav);
