import actionTypes from '../constants/actions';

export function increaseCounter() {
    return {
        type: actionTypes.INCREASE_COUNTER
    };
}

export function decreaseCounter() {
    return {
        type: actionTypes.DECREASE_COUNTER
    };
}

export function increaseCounterLater() {
    return dispatch => {
        dispatch({
            type: actionTypes.INCREASE_COUNTER_LATER
        });
        setTimeout(() => {
            dispatch(increaseCounter());
        }, 2000);
    };
}
