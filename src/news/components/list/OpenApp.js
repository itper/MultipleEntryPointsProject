/**
 * Created by chendi on 16/11/4.
 */
import React,{Component} from 'react';
import Log from '../../../lib/components/Log';
console.log(Log);
import classnames from 'classnames';
var ToApp = require('../../util/GoToApp');
require('./open_app.css');
export default class OpenApp extends Component{
    constructor(props){
        super(props);
        this.state = {banner:props.banner,logo:props.logo,toTop:props.toTop};
        this.hideToTop = true;
    }

    componentDidMount(){
        ToApp.init(
            this.props,
            (url)=>{
                this.setState({...this.state,url});
            },
            (frameUrl)=>{
                this.setState({...this.state,frameUrl});
            }
        );
        window.onscroll = ()=> {
            if (document.body.scrollTop > document.documentElement.clientHeight - 100 && this.hideToTop) {
                this.hideToTop = false;
                this.setState({...this.state, toTop: true});
            }
            if (document.body.scrollTop < document.documentElement.clientHeight - 100 && !this.hideToTop) {
                this.hideToTop = true;
                this.setState({...this.state, toTop: false});
            }
        }
    }
    openApp(){

    }
    createBottom(){
        return (
            <div>
                <div className="gj-btn">
                    <div className="gj-go-top"
                         id="gototop"
                         data-gjalog="100000002171000100000010"
                         style={{"display": this.state.toTop?'block':'none'}}
                         onClick={()=>{
                            document.getElementsByTagName('body')[0].scrollTop=0;
                        }}
                    >
                        <i></i>
                        <div className="gj-line"
                             id="gj_line"
                             style={{"display": this.state.toTop?'block':'none'}}>
                        </div>
                    </div>
                    <div className={classnames({"guide-logo":true, "guide-logo-hide":this.state.logo})}
                         id="guide_logo"
                         onClick={()=>{
                                    this.props.onClose&&this.props.onClose(false);
                                    this.setState({...this.state,banner:true,logo:false});
                         }}
                         data-gjalog="100000002172000100000010">
                        <i></i>
                    </div>
                </div>

                <div className={classnames({"bottom-guide":true,'guide-hide':!this.state.banner})} id="bannerDown">
                    

                    <Log gjalog='100000002075000100000010'
                            cainfo='{"ca_name":"_WapWdAndroid","ca_source":"-","ca_id":"-","ca_kw":"-","ca_n":"-","ca_s":"self","ca_i":"-"}'

                            gc={"/zixun/"+this.props.tab+"/-/-/"+this.props.pageType+"@appDownloadShown=1@spider=1@page=1"}
                            gjch="/zixun//list@mobile=3g"
                    >
                    <a className="guide-cont clear"
                       href={this.state.url||this.props.url}
                       onClick={(e)=>{
                        e.preventDefault();
                        ToApp.goNativeView();
                    }}
                    >
                        <span className="guide-logo"></span>
                        <div className="guide-slogon">App&nbsp;速度快&nbsp;省流量</div>
                        <span className="guide-btn">立即打开</span>
                    </a>
                    </Log>
                <span className="guide-close"
                      data-gjalog="100000002170000100000010"
                      onClick={()=>{
                            this.props.onClose&&this.props.onClose(true);
                      this.setState({...this.state,banner:false,logo:true});
                        }}
                >
                </span>
                    <iframe style={{display:'none',border:0,width:0,height:0}} frameBorder="0" src={this.state.frameUrl}></iframe>
                </div>
            </div>
        )
    }
    createTop(){
        return (

            <Log gjalog='100000002075000100000010'
                    cainfo='{"ca_name":"_WapWdAndroid","ca_source":"-","ca_id":"-","ca_kw":"-","ca_n":"-","ca_s":"self","ca_i":"-"}'

                    gc={"/zixun/"+this.props.tab+"/-/-/"+this.props.pageType+"@appDownloadShown=1@spider=1@page=1"}
                    gjch="/zixun//list@mobile=3g"
            >
            <div id="topToAppBanner">
                <a className="guide-cont clear"
                   href={this.state.url||this.props.url}
                   onClick={(e)=>{
                       e.preventDefault();
                        ToApp.goNativeView();
                    }}
                >
                    <img
                        src="http://sta.ganjistatic1.com/src/image/mobile/touch/guide/logo_app_gjsh.png?v=1'"
                        alt=""
                        className="guide-logo"/>
                        <span>下载赶集APP，更多好看资讯一网打尽</span>
                        <span
                            href=""
                            className="guide-btn"
                            data-gjalog="100000002082000100000010"
                            data-role="link">
                            立即打开
                        </span>
                </a>
            </div>
            </Log>
        )
    }
    render(){
        return (
            <div>
                {
                    (()=>{
                        if(this.props.position=='top'){
                            return this.createTop();
                        }else if(this.props.position=='bottom'){
                            return this.createBottom();
                        }else{
                            return (
                                <div>
                                    {this.createTop()}
                                    {this.createBottom()}
                                </div>
                            )
                        }
                    })()
                }
            </div>
        )
    }
}
OpenApp.defaultProps = {
    url:'https://applesite.ganji.com?data=%7B%22cParam%22%3A%7B%22fromurl%22%3A%22http%3A%2F%2F3g.ganji.com%2F%22%2C%22from%22%3A%22wap%22%7D%2C%22bParam%22%3A%7B%22title%22%3A%22%22%7D%2C%22arg%22%3A%22http%3A%2F%2Fganji.cn%2Ft%2FHj9A1O%22%2C%22root_url%22%3A%22http%3A%2F%2Fsta.ganji.com%2Fatt%2Fproject%2Ftouch%2Fdownload_app%2Findex.html%3F%22%2C%22other_url%22%3A%22https%3A%2F%2Fapplesite.ganji.com%22%2C%22schemaParm%22%3A%22ganji%3A%2F%2Fapp%3F%22%7D',
    banner:true,
    logo:false,
    toTop:false
};