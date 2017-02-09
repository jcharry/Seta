import React from 'react';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import Main from '../components/Main';

export default (
    <Router history={browserHistory}>
        <Route path='/'>
            <IndexRoute component={Main} />
        </Route>
    </Router>
);
