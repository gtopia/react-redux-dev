import actionTypes from '../constants/actions';
import { Map } from 'immutable';

const initialState = Map({
    counter: 10,
    isLoading: false,
});

export default function demoReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.INCREASE_COUNTER:
            return state
                .update('counter', (counterState) => counterState + 1)
                .update('isLoading', () => false);
        case actionTypes.DECREASE_COUNTER:
            return state
                .update('counter', (counterState) => counterState - 1)
                .update('isLoading', () => false);
        case actionTypes.INCREASE_COUNTER_LATER:
            return state.update('isLoading', () => true);
        default:
            return state;
    }
};
