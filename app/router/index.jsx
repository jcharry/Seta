import React from 'react';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import Main from '../components/Main';
import GettingStarted from '../components/GettingStarted';

export default (
    <Router history={browserHistory}>
        <Route path='/'>
            <IndexRoute component={Main} />
            <Route path='/getting-started' component={GettingStarted} />
        </Route>
    </Router>
);
