/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Action type集合。
 */
var keyMirror = require('keymirror');

export default keyMirror({
    // Demo page actions
    INCREASE_COUNTER: null,
    DECREASE_COUNTER: null,
    INCREASE_COUNTER_LATER: null,

    // Main actions
    SET_LOADING: null,
    LOGIN_SUCCESS: null,
    SHOW_ME: null,
    HIDE_ME: null,
    WANT_TO_LOGOUT: null,
    CANCEL_LOGOUT: null,
    LOGOUT_SUCCESS: null,
    CHECK_STYLE: null,
    SHOW_FAV: null,
    CLOSE_FAV: null,
    SHOW_FAV_GUIDE: null,
    CLOSE_FAV_GUIDE: null,
});
