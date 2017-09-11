/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Store配置。
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// import { routerMiddleware } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';

// const history = createHistory();
// const middleware = routerMiddleware(history);
const middlewares = [thunk];
const finalCreateStore = compose(
	applyMiddleware(...middlewares),
)(createStore);

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState);

	if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};
