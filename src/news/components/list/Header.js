import React,{Component} from 'react';
require('./header.css');
export default class Header extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }


    render(){
        const {city}=this.state;
        const {top}=this.props;
        return (
            <header id="header" className="gj-header gj-header-active">
                <div className="gj-logo clear btmbr">
                    <a href="http://3g.ganji.com/bj/" className="logo logo-top-active" data-gjalog="100000002060000100000010"></a>

                    <nav className="site-nav site-nav-active">
                        <a href="http://3g.ganji.com/bj_user/index/?ifid=new_shouye_cpdenglu" data-gjalog="100000002062000100000010">
                            <i className="ucenter"></i>
                            <span className="tp">我的</span>
                        </a>
                        <a href="http://3g.ganji.com/bj_pub/index/?ifid=new_shouye_pub" data-gjalog="100000002063000100000010">
                            <i className="publish"></i>
                            <span className="tp">发布</span>
                        </a>
                    </nav>
                </div>
                <div className="headbg headbg-active"></div>
            </header>
        )
    }
}