import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Middleware } from 'redux';
import logger from 'redux-logger';

import createSagaMiddleware from 'redux-saga';

import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import Router, { history } from './routes';
import { reducers } from './store';
import { socketMiddleware } from "../common/utils/socketMiddleware/socketMiddleware";

import rootSaga from './sagas';

import 'antd/dist/antd.css';

const sagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [socketMiddleware('wss://hometask.eg1236.com/game1/'), sagaMiddleware, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development')
  middlewares.push(logger);

const store = createStore(reducers(history), composeWithDevTools(applyMiddleware(...middlewares)));
sagaMiddleware.run(rootSaga);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById('root'),
  );
});
