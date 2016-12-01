import React from 'react';
import {Router, Route , browserHistory } from 'react-router';
import DetailsPage from 'news/container/detailsPage';

const routes = (
    <Router history={browserHistory}>
        <Route path='/'>
            <Route path='information(/:newsid/:tabid)' component={DetailsPage}/>
        </Route>
    </Router>
);

export default routes;