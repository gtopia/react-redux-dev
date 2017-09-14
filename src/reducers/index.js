/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Root reducer配置。
 */
import { combineReducers } from 'redux';
import app from './app';
import main from './main';
import cmnt from './comment';

const rootReducer = combineReducers({
    app,
    main,
    cmnt,
});

export default rootReducer;
