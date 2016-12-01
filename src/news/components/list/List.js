import React, {Component,PropTypes} from 'react';
import Item from './Item';

class List extends Component{
    constructor(props) {
        super(props);
    }

    handleClick(e){
        this.context.router.push();
    }

    render(){
        const {list,selected} = this.props;
        return(
            <ul className="glist">
                {list.map((item,index)=> {
                    return(

                            <Item data={item} lastItem={index===list.length-1} key={item.newsid} url={'/'+item.newsid+'/'+this.props.selected}/>
                        )

                })}
            </ul>
        );
    }
}
List.contextTypes = {
    router:React.PropTypes.object
};
List.propTypes = {

};
List.defaultProps =  {
        list:[]
};
List.propTypes = {

};
export default List;