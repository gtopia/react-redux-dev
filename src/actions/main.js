import actionTypes from '../constants/actions';

export function _setLoading(state) {
    return {
        type: actionTypes.SET_LOADING,
        state
    };
};

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

export function showMe() {
    return {
        type: actionTypes.SHOW_ME,
    };
}

export function checkLoginStatus() {
    return (dispatch) => {
        if (!window.checkLogin()) {
            dispatch({
                type: actionTypes.LOGOUT_SUCCESS,
            });
        }
        else {
            window.getUserInfo(function(res) {
                dispatch(_loginSuccess(res || {}));
            });
        }
    };
};

export function handleLogin() {
    return (dispatch) => {
        if (!window.checkLogin()) {
            window.location.href = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&backTitle=全民话题&r=' + encodeURIComponent(window.location.href) + '&revalid=2';
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

export function closeFav() {
    return {
        type: actionTypes.CLOSE_FAV,
    };
}
