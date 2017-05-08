import { combineReducers } from 'redux';
import main from './main';
import demo from './demo';

const rootReducer = combineReducers({
    main,
    demo
});

export default rootReducer;
