
import * as React from 'react';
import { createBrowserHistory, History } from 'history';
import { Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';

import { Auth, SoloPlayground, DuoPlayground } from '../containers';

export const history = createBrowserHistory() as History;

export default () => (
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={Auth} />
            <Route exact path="/g/" component={SoloPlayground} />
            <Route exact path="/g/:id/" component={DuoPlayground} />
            <Route path="*" component={() => ( <div /> )} />
        </Switch>
    </Router>
);
