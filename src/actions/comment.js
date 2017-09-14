/**
 * Author: zhiyou
 * Date: 2017/05/19
 * Description: 评论组件action。
 */
import actionTypes from '../constants/actions';

export function showCmntsPopup() {
    return {
        type: actionTypes.SHOW_CMNTS_POPUP,
    };
}

export function hideCmntsPopup() {
    return {
        type: actionTypes.HIDE_CMNTS_POPUP,
    };
}
