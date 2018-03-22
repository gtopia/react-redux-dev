import actionTypes from '../constants/main';

function increase() {
    return {
        type: actionTypes.INCREASE,
    };
}

export function increaseLater() {
    return (dispatch) => {
        dispatch(setLoading(true));

        setTimeout(() => {
            dispatch(increase());
            dispatch(setLoading(false));
        }, 3000);
    };
};

export function decrease() {
    return {
        type: actionTypes.DECREASE,
    };
}

export function setLoading(isShow) {
    return {
        type: actionTypes.SET_LOADING,
        isShow: isShow
    };
}
