import React , { PropTypes , Component } from 'react';

class AppBanner extends Component {

    constructor(props) {
        super(props);
        this.openApp = this.openApp.bind(this);

    }

    openApp()
    {
        window.alert('打开');
    }

    render(){
        const { isShow } = this.props;
        var displayStyle;
        if(!isShow)
        {
            displayStyle = {display : 'none'};
        }
        else
        {
            displayStyle = {};
        }

        return (
                <div className="app-guide" style={displayStyle}>
                    <a href="javascript:void(0);" className="guide-cont clear">
                        <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/guide/logo_app_gjsh.png" alt=""
                             className="guide-logo"/>

                        <div className="guide-slogon">赶集生活</div>
                        <div className="guide-dc">赶集资讯</div>
                    </a>
                    <a href="javascript:void(0);" className="guide-btn" id="openapp" onClick={this.openApp}>打开</a>
                </div>

        );
    }
}

AppBanner.propTypes = {
    isShow : PropTypes.bool.isRequired
};

export default AppBanner;