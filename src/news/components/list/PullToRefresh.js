import React ,{Component,PropTypes} from 'react';
require('./pull_to_refresh.css');
export const LOADING = 'loading';
class PullToRefresh extends Component{
    constructor(props){
        super(props);
        this.container = null;
        this.startPoint = 0;
        this.triggerDistance = 50;
        this.maxDistance = 100;
        this.offsetY = 0;
        this.body = null;
        this.direction = null;
        this.previousPointY = 0;
        this.enough = false;
        this.lock = false;
        this.onRefresh = props.onRefresh||function(){
                setTimeout(()=>{
                    this.refreshOver();
                },1000);
        };
        this.state = {text:'下拉刷新'};
    }
    componentDidMount(){
        this.container = this.refs.container;
        this.body = document.getElementsByTagName('body')[0];
    }
    touchstart(e){
        if(this.lock){
            e.preventDefault();
            return;
        }
        this.startPoint = {x:e.touches[0].clientX,y:e.touches[0].clientY};
        this.offsetY = 0;
        this.previousPointY = this.startPoint.y;
        this.direction = null;
    }
    touchmove(e){
        var currentPoint = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
        this.direction = this.direction?this.direction:getDirection(this.startPoint,currentPoint);
        if(this.body.scrollTop==0 && this.direction && this.direction!='top'){
            e.preventDefault();
            if(this.direction=='bottom'){
                this.lock = true;
                this.offsetY += parseInt(((this.maxDistance-this.offsetY)/100)*(currentPoint.y - this.previousPointY));
                this.previousPointY = currentPoint.y;
                this.offsetY = this.offsetY<0?0:this.offsetY;
                if(this.offsetY>this.triggerDistance && !this.enough){
                    // $(this).trigger('enough');
                    this.setState({...this.state,text:'释放刷新'});
                    this.enough = true;
                }
                if(this.offsetY<this.triggerDistance && this.enough){
                    this.setState({...this.state,text:'下拉刷新'});
                    // $(this).trigger('unenough');
                    this.enough = false;
                }
                this.container.style["transform"] = "translateY(" + this.offsetY + "px)";
                this.container.style['transition']='none';
                this.container.style["-webkit-transform"]= "translateY(" + this.offsetY + "px)";
            }
        }
    }
    touchend(e){
        if(this.body.scrollTop==0 && this.direction=='bottom'){
            this.lock = false;
            if(this.offsetY>this.triggerDistance){
                this.container.style["transform"] = "translateY("+this.triggerDistance+"px)";
                this.container.style["-webkit-transform"] = "translateY("+this.triggerDistance+"px)";
                this.container.style['transition']='all 0.2s ease 0s';
                // this.container.trigger('refresh');
                if(this.onRefresh)this.onRefresh(()=>{
                    this.refreshOver();
                });
            }else{
                this.container.style["transform"] = "translateY(0)";
                this.container.style["-webkit-transform"] = "translateY(0)";
                this.container.style['transition']='all 0.2s ease 0s';
                this.setState({...this.state,text:'下拉刷新'});
            }
        }
    }
    refreshOver (){
        this.container.style["transform"]="translateY(0)";
        this.container.style["-webkit-transform"]="translateY(0)";
        this.container.style['transition']='all 0.2s ease 0s';
        this.setState({...this.state,text:'下拉刷新'});
    }
    createStyle(isLoading){
        return{
            transform: 'translateY('+(isLoading?50:0)+'px)',
            transition: 'all 0.2s ease 0s'
        }
    }
    shouldComponentUpdate(props,state){
        return props.isLoading!==void 0;
    }
    render(){
        const {isLoading,children}=this.props;
        return(
            <div className={"pull_to_refresh "}
                 style={this.createStyle(isLoading)}
                 onTouchStart={this.touchstart.bind(this)} onTouchMove={this.touchmove.bind(this)}
                 onTouchEnd={this.touchend.bind(this)} ref="container">
                <div id="pull_to_refresh_title">
                    {this.state.text}
                </div>
                {children}
            </div>
        )
    }
}

function getDirection(start,current){
    var x = current.x - start.x;
    var y = current.y - start.y;
    if(Math.abs(x)>Math.abs(y)){
        if(x>0){
            return('right');
        }else{
            return('left');
        }
    }else if (Math.abs(x)<Math.abs(y)){
        if(y>0){
            return('bottom');
        }else{
            return('top');
        }
    }
}
export default PullToRefresh;