import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ConnectedRouter } from 'connected-react-router';

import ErrorBoundary from '../common/components/ErrorBoundary/ErrorBoundary';

export enum MenuItems {
  Minesweaper = '/minesweaper',
}

export interface IRoute {
  path: MenuItems;
  component: React.ComponentType<any>;
  exact: boolean;
}

const defaultPath = MenuItems.Minesweaper;

const routes: IRoute[] = [
  {
    component: lazy(() => import(/* webpackChunkName: "Minesweaper" */ '../features/Minesweaper')),
    exact: true,
    path: MenuItems.Minesweaper,
  },
];

export const history = createBrowserHistory();

class Router extends React.Component<{}, {}> {
  public render() {
    return (
      <ConnectedRouter history={history}>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to={defaultPath} />} />
              {routes.map((route) => (
                <Route
                  path={route.path}
                  component={route.component}
                  key={route.path}
                  exact={route.exact}
                />
              ))}
              <Route component={() => <div>Route doesnt exsist</div>} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </ConnectedRouter>
    );
  }
}

export default Router;
