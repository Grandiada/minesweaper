import { History } from 'history';
import { combineReducers, Reducer } from 'redux';

import { connectRouter, RouterState } from 'connected-react-router';
import minesweaperReducer, { minesweaperTypes } from '../features/Minesweaper/duck';

// The top-level state object
export interface IApplicationState {
  router: RouterState;
  minesweaper: minesweaperTypes.IMinesweaperState
}

export const reducers = (history: History): Reducer<IApplicationState> => combineReducers<IApplicationState>({
  router: connectRouter(history),
  minesweaper: minesweaperReducer
});
