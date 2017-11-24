import React , { PropTypes , Component } from 'react';
import { isArray } from '../util/tool';
import CommonLink from './list/CommonLink';

import { Link } from 'react-router';

class Item1 extends Component {

    render(){
        const { info , category } = this.props;
        var imgUrl = info.images ? (isArray(info.images)? info.images[0] : info.images) : '';
        return (
            <li>
                <CommonLink to={'/'+info.newsid+'/'+category}>
                    <div className="info-box clearfix">
                        <div className="info-img fl"><img src={imgUrl}/></div>
                        <div className="info-content">
                            <div className="title">{info.title}</div>
                            <div className="source">{info.source}</div>
                            <div className="date">{info.create_time}</div>
                        </div>
                    </div>
                </CommonLink>
                <div className="relate-line"></div>
            </li>
        );
    }
}


Item1.PropTypes = {
    infoItem : PropTypes.object.isRequired
};

export default Item1;