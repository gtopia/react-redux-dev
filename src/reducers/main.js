/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 首页reducer。
 */
import { Map } from 'immutable';
import actionTypes from '../constants/actions';

const initialState = Map({
    userInfo: Map({
        islogin: 0,
        nick: '',
        portrait_url: '',
        return_url: '',
        uid: '',
        uname: '',
        userface: ''
    }),
    hasMoreTopic: false,
    isShowMe: false,
    isWant2Logout: false,
    isShowFav: false,
    isShowFavGuide: false,
});

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS: {
            return state.set('userInfo', Map(action.userInfo));
        }
        case actionTypes.SHOW_ME: {
            return state.set('isShowMe', true);
        }
        case actionTypes.HIDE_ME: {
            return state.set('isShowMe', false);
        }
        case actionTypes.WANT_TO_LOGOUT: {
            return state.set('isShowMe', false).set('isWant2Logout', true);
        }
        case actionTypes.CANCEL_LOGOUT: {
            return state.set('isWant2Logout', false);
        }
        case actionTypes.LOGOUT_SUCCESS: {
            state = state.set('userInfo', Map({
                islogin: 0,
                nick: '',
                portrait_url: '',
                return_url: '',
                uid: '',
                uname: '',
                userface: ''
            }));
            return state.set('isWant2Logout', false);
        }
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
