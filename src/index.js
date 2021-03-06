import './static/style/base.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import appRoute from './route';

const store = configureStore();

ReactDOM.render (
	<Provider store={store}>
	    {appRoute()}
	</Provider>,
	document.getElementById('root')
);
