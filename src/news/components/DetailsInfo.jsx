import React , { PropTypes , Component } from 'react';

class DetailsInfo extends Component {


    render(){
        const { title , source , create_time } = this.props;
        return (
            <div>
                <h3>{title}</h3>
                <p className="info">
                    <span className="source">{source}</span>
                    <span className="releae_time">{create_time}</span>
                </p>
                <p className="gray_line"></p>
            </div>
        );
    }
}

DetailsInfo.PropTypes = {
    title : PropTypes.string.isRequired ,
    source : PropTypes.string.isRequired ,
    create_time : PropTypes.string.isRequired
};

export default DetailsInfo;