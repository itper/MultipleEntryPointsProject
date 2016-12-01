import React from 'react';
import {Route, Redirect} from 'react-router';
import App from './App';
import IndexPage from './IndexPage';

const ROOT = '/'+window.WEBPACK_TPATH;


export default(
    <Route>
        <Redirect from={ROOT} to={ROOT+"/recomm"}/>
        <Route path={ROOT} component={App}
               /*onEnter={
                    ({params},replace)=>{
                        if(!params.tab)
                            replace('/recomm')
                    }
               }*/
        >
                <Route path=":tab" component={IndexPage} />
        </Route>
        <Redirect from='*' to={ROOT+"/recomm"}/>
    </Route>
)