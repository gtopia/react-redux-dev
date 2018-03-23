import { Map } from 'immutable';
import actionTypes from '../constants/main';

const initialState = Map({
    isShowLoading: false,
    totalCount: 0
});

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.INCREASE: {
            return state.update('totalCount', () => state.get('totalCount') + 1);
        }
        case actionTypes.DECREASE: {
            return state.update('totalCount', () => state.get('totalCount') - 1);
        }
        case actionTypes.SET_LOADING: {
            return state.set('isShowLoading', action.isShow);
        }
        default: {
            return state;
        }
    }
};
