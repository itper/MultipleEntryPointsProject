import React ,{Component,PropTypes} from 'react';
import {Link} from 'react-router';
require('./tab_bar.css');
import CommonLink from './CommonLink';
import classnames from 'classnames';
class TabBar extends Component{
    constructor(props){
        super(props);
        this.state = {leftShadow:false,rightShadow:true};
    }
    render(){
        const {items,selected,top} = this.props;
        return (<div id="top-nav-tab"
                     className = {classnames({clearfix:false,'left_shadow':this.state.leftShadow,'right_shadow':this.state.rightShadow})}
                     style={{top:top}}
        >
            <ul  onTouchEnd={(e)=>{
                var ul = e.currentTarget;
                var clientWidth = ul.clientWidth;
                var contentWidth = ul.scrollWidth;
                this.setState({...this.state,rightShadow:ul.scrollLeft+clientWidth+10<contentWidth});
                this.setState({...this.state,leftShadow:ul.scrollLeft>10});
                setTimeout(()=>{
                    this.setState({...this.state,leftShadow:ul.scrollLeft>10});
                    this.setState({...this.state,rightShadow:ul.scrollLeft+clientWidth+10<contentWidth});
                },600);
            }}
            >
                {items.map(item=>{
                    return (
                        <li className={classnames({"nav-tab":true,active:item.value===selected})} key={item.value}>
                        <CommonLink to={`/${item.value}`}>
                                {item.title}
                        </CommonLink>
                        </li>
                    )
                })}
            </ul>
            <p className="under-line"/>
        </div>)
    }
}
TabBar.propTypes = {
    selected:PropTypes.string.isRequired
};
export default TabBar;