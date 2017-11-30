/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 首页reducer。
 */
import { Map } from 'immutable';
import actionTypes from '../constants/main';

const initialState = Map({
    isShowFav: false,
    isShowFavGuide: false,
});

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_FAV: {
            return state.set('isShowFav', true);
        }
        case actionTypes.CLOSE_FAV: {
            return state.set('isShowFav', false);
        }
        case actionTypes.SHOW_FAV_GUIDE: {
            return state.set('isShowFavGuide', true);
        }
        case actionTypes.CLOSE_FAV_GUIDE: {
            return state.set('isShowFavGuide', false);
        }
        default: {
            return state;
        }
    }
};
