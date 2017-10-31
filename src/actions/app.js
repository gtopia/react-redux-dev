/**
 * Author: zhiyou
 * Date: 2017/06/08
 * Description: 导航页action。
 */
import actionTypes from '../constants/actions';

export function activateMenu(menuName) {
    return {
        type: actionTypes.ACTIVATE_MENU,
        menuName
    };
}

export function _loginSuccess(userInfo) {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        userInfo
    };
}

export function _want2Logout() {
    return {
        type: actionTypes.WANT_TO_LOGOUT,
    };
}

export function toggleMe() {
    return {
        type: actionTypes.TOGGLE_ME,
    };
}

export function checkLoginStatus(callback) {
    return (dispatch) => {
        if (!window.checkLogin()) {
            dispatch({
                type: actionTypes.LOGOUT_SUCCESS,
            });
        }
        else {
            window.getUserInfo(function(res) {
                dispatch(_loginSuccess(res || {}));

                if (callback && (typeof callback == 'function')) {
                    callback();
                }
            });
        }
    };
};

export function handleLogin() {
    return (dispatch) => {
        if (!window.checkLogin()) {
            window.location.href = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&backTitle=全民话题&r=' + encodeURIComponent(window.location.href) + '&revalid=1';
        }
        else {
            window.getUserInfo(function(res) {
                dispatch(_loginSuccess(res || {}));
            });
        }
    };
};

export function want2Logout() {
    return (dispatch) => {
        if (window.checkLogin()) {
            dispatch(_want2Logout());
        }
    };
};

export function cancelLogout() {
    return {
        type: actionTypes.CANCEL_LOGOUT,
    };
}

export function handleLogout() {
    return (dispatch) => {
        if (window.checkLogin()) {
            window.location.href = 'http://passport.sina.cn/sso/logout?entry=wapsso&vt=4&backTitle=全民话题&r=' + encodeURIComponent(window.location.href) + '&revalid=2';
            dispatch({
                type: actionTypes.LOGOUT_SUCCESS,
            });
        }
    };
};

export function hideShowMePrompts() {
    return {
        type: actionTypes.HIDE_ME,
    };
}

export function showMoreTopics() {
    return {
        type: actionTypes.SHOW_MORE_TOPICS,
    };
}

export function hideMoreTopics() {
    return {
        type: actionTypes.HIDE_MORE_TOPICS,
    };
}
