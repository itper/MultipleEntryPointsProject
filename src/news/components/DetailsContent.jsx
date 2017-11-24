import React , { PropTypes , Component } from 'react';
import {htmlDecode} from '../util/tool';

class DetailsContent extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     isZan : props.isZan,
        //     zanNum : 0
        // };
        // this.zanClick = this.zanClick.bind(this);
    }

    // zanClick() {
    //     if(this.state.isZan) {
    //         this.setState({
    //             isZan : !this.state.isZan,
    //             zanNum : --this.state.zanNum
    //         });
    //     } else {
    //         this.setState({
    //             isZan : !this.state.isZan,
    //             zanNum : ++this.state.zanNum
    //         });
    //     }
        
    // }

    render(){
        const { content } = this.props;
        // var imgSrc = '';
        // if(this.state.isZan) {
        //     imgSrc = './img/yizan.png';  
        // } else {
        //     imgSrc = './img/zan.png';
        // }
        return (
            <div className="content" dangerouslySetInnerHTML={{__html: htmlDecode(content)}}></div>
        );
    }
}

DetailsContent.PropTypes = {
    content : PropTypes.string.isRequired,
    zanNum : PropTypes.number.isRequired
};

export default DetailsContent;