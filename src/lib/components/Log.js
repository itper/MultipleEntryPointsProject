import React,{Component} from 'react';
import qs from 'query-string';
import GJLog from '../ganjilog.js';
var timing = {START:0};
var currentUrl = '';
if(typeof window!=='undefined'){
	timing={START: Date.now() - window.GJ_START_TIMESTAMP};
}

class Log extends Component{
	constructor(prop){
		super(prop);
	}
	componentDidMount(){
		this.gjlog = new GJLog(this.props);
		if(currentUrl!==window.location.href){
			timing.VIEW = Date.now() - timing.START - window.GJ_START_TIMESTAMP;
			timing.DURATION = Date.now() - window.GJ_START_TIMESTAMP;
			this.gjlog.sendlog(qs.stringify(timing), '//tralog.ganji.com/ng/h5p.gif?');
		}
		currentUrl = window.location.href;
	}
	render(){
		return (
			<div onClick={()=>{
				this.gjlog.trigger(this.props.gjalog);
			}}>
				{this.props.children}
			</div>
		)
	}
}
export default Log;