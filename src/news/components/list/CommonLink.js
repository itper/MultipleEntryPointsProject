/**
 * Created by chendi on 16/9/23.
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class CommonLink extends Component {
    render(){
        var to ='/'+window.WEBPACK_TPATH+this.props.to+'?';
        Object.keys(this.context.urlQuery).map((p)=>{
            to+=p + '=' + this.context.urlQuery[p] + '&';
        });
        to = to.substring(0,to.length-1);
        const p = {...this.props,to:to}
        return(<Link {...p}/>)
    }

}
CommonLink.contextTypes={
    urlQuery:React.PropTypes.object
}
export default CommonLink;