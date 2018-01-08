 /* 
 * Author: jinping3
 * Date: 2017/05/10
 * Description: 分享组件弹层。
 * Modify: zhiyou@2017/12/06 添加shouldComponentUpdate函数，优化组件性能。
 */
import './index.scss';
import React, { Component }from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Share extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.shareWarperState === this.props.shareWarperState &&
            nextProps.safariState === this.props.safariState &&
            nextProps.wxState === this.props.wxState) {
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        let shareWarper = classNames({
            'share-warper__tips': this.props.shareWarperState
        });
        let shareMask = classNames({
            'sw__mask': this.props.shareWarperState
        });
        let shareSafari = classNames({
            'sw__safariimg': this.props.safariState
        });
        let shareWX = classNames({
            'sw__wxpromit': this.props.wxState
        });

        return (
            <div className={shareWarper} onClick={this.props.hideWXShare}>
                <div className={shareMask}></div>
                <i className={shareSafari}></i>
                <i className={shareWX}></i>
            </div>
        );
    }
}

Share.propTypes = {
    shareWarperState: PropTypes.bool,
    safariState: PropTypes.bool,
    wxState: PropTypes.bool,
    hideWXShare: PropTypes.func
};

Share.defaultProps = {
    shareWarperState: false,
    safariState: false,
    wxState: false,
    hideWXShare: () => {}
};

export default Share;
