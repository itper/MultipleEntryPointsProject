import React from 'react';
import {Route , browserHistory,Redirect } from 'react-router';
import DetailsPage from './container/detailsPage';
if(typeof window==='undefined'){
    global.window={};
    global.window.WEBPACK_TPATH = 'information';
}
const ROOT = '/'+window.WEBPACK_TPATH;
import App from './container/list/App';
import IndexPage from './container/list/IndexPage';

const routes = (
    <Route history={browserHistory}>
        <Redirect from={ROOT} to={ROOT+"/recomm"}/>
        <Route path={ROOT} component={App}>
            <Route path=":tab" component={IndexPage} />
            <Route path=':newsid/:tabid' component={DetailsPage}/>
        </Route>
        <Redirect from='*' to={ROOT+"/recomm"}/>
    </Route>
);

export default routes;