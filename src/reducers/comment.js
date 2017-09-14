/**
 * Author: zhiyou
 * Date: 2017/05/19
 * Description: 评论组件reducer。
 */
import { Map } from 'immutable';
import actionTypes from '../constants/actions';

const initialState = Map({
    isShowPopup: false,
    isShowEmptyPrompt: false,
});

export default function commentReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_CMNTS_POPUP: {
            $('body').css('overflow-y', 'hidden');
            return state.set('isShowPopup', true);
        }
        case actionTypes.HIDE_CMNTS_POPUP: {
            $('body').css('overflow-y', 'auto');
            return state.set('isShowPopup', false);
        }
        default: {
            return state;
        }
    }
};
