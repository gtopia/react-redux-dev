/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Root reducer≈‰÷√°£
 */
import { combineReducers } from 'redux';
import app from './app';
import main from './main';

const rootReducer = combineReducers({
    app,
    main,
});

export default rootReducer;
