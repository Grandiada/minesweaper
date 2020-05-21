import { History } from 'history';
import { combineReducers, Reducer } from 'redux';

import { connectRouter, RouterState } from 'connected-react-router';

// The top-level state object
export interface IApplicationState {
  router: RouterState;
}

export const reducers = (history: History): Reducer<IApplicationState> => combineReducers<IApplicationState>({
  router: connectRouter(history),
});
