// Immutable
import { Map, List } from 'immutable';
// Constants
import actionTypes from '../constants/actions';

const initialState = Map({
    navItems: List.of(
        Map({
            displayText: 'Main',
            link: '/'
        }),
        Map({
            displayText: 'Demo',
            link: '/demo'
        }),
    ),
    currentSelectedPageSubMenu: List.of(),
    hasLogo: true
});

const updateNavigationItem = (state) => {
    return state;
};

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_CURRENT_USER_SUCCESS:
            return updateNavigationItem(state, action);
        case actionTypes.LOGIN_SUCCESS:
            return updateNavigationItem(state, action);
        case actionTypes.SET_CURRENT_SELECTED_PAGE_NAME:
            let newSubMenu = state.get('subMenu').get(action.name);
            return state.set('currentSelectedPageSubMenu', newSubMenu ? newSubMenu : List.of());
        default:
            return state;
    }
};
