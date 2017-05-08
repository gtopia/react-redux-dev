import actionTypes from '../constants/actions';

export function setCurrentSelectedUserId(id) {
    return {
        type: actionTypes.SET_CURRENT_SELECTED_USER_ID,
        id
    };
};

export function setCurrentSelectedPageName(name) {
    return {
        type: actionTypes.SET_CURRENT_SELECTED_PAGE_NAME,
        name
    };
};
