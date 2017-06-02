/**
 * Author: zhiyou
 * Date: 2017/05/31
 * Description: 返回顶部组件。
 */
import './index.scss';
import React, { Component } from 'react';
import classNames from 'classnames';

class BackTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isShow': false
        };
    }

    componentDidMount() {
        let _this = this;
        let $win = $(window);

        $win.on('scroll', function() {
            if ($win.scrollTop() > window.innerHeight) {
                if (_this.refs['comp_backtop']) {
                    _this.setState({'isShow': true});
                }
            }
            else {
                if (_this.refs['comp_backtop']) {
                    _this.setState({'isShow': false});
                }
            }
        });
    }

    componentWillUnmount() {
        this.setState({'isShow': false});
    }

    _handleBackTop() {
        $(window).scrollTop(0);
    }

    render() {
        let backTopClass = classNames({
            'backtop': true,
            'hide': !this.state.isShow
        });

        return (
            <div ref="comp_backtop" className={backTopClass} onClick={this._handleBackTop.bind(this)}></div>
        );
    }
}

export default BackTop;
