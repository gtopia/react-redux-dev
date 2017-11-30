/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Root reducer配置。
 */
import { combineReducers } from 'redux';
import app from './app';
import main from './main';
import cmnt from './comment';
import share from './share';
import topic from './topic';
import message from './message';

const rootReducer = combineReducers({
    app,
    main,
    cmnt,
    share,
    topic,
    message
});

export default rootReducer;
