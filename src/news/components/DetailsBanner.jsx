import React , { Component , PropTypes } from 'react';

class DetailsBanner extends Component {

    constructor() {
        super();
        this.subhomepage = this.subhomepage.bind(this);
    }

    subhomepage() {
        console.log(1);
    }

    render(){
        // console.log(this.props);
        const { version , jump_text , major_category_id } = this.props;

        var jump, majorStyle;

        if(!version && jump_text) {
            jump = <p className="active_title"><a href="javascript:void(0);" onClick={this.subhomepage}>{jump_text}</a></p>;
        } else {
            jump = '';
        }

        if(major_category_id==='9') {
            majorStyle = {};
        } else {
            majorStyle = {display : 'none'};
        }

        return (
            <section className="detail_banner_box">
                <div className="active_banner_box">
                    {jump}
                    <div style={majorStyle} className="details_banner"><a href="javascript:void(0)"></a></div>
                </div>
                <p className="content_line"></p>
            </section>
        );
    }
}

DetailsBanner.PropTypes = {
    version : PropTypes.bool.isRequired,
    jump_text : PropTypes.string.isRequired,
    major_category_id : PropTypes.string.isRequired
};

export default DetailsBanner;