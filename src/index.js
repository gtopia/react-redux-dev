// Styles
import './static/style/base.css';

// Libraries
import 'zepto';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Store
import configureStore from './store';

// Routes
import appRoute from './route';

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
	    {appRoute(store)}
	</Provider>,
	document.getElementById('root')
);
