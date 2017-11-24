/**
 * Created by chendi on 16/9/28.
 */

import React, {Component, PropTypes} from 'react';
require('./loadmore.css');
import classnames from 'classnames';


export const LOAD_MORE = 'load-more';
export const LOADING = 'loading';
export const NOT_MORE = 'not-more';
export const LOAD_FAILURE = 'load=failure';
class LoadMore extends Component {
    constructor(props) {
        super(props);
        //this.state = {};
    }

    //updating
    /**
     componentWillReceiveProps(nextProps){
    }
     **/
    shouldComponentUpdate1(props,state){
        console.log(props.state);
        return props.state!==void 0;
    }
    //mounting
    /**
     componentWillMount(){
    
    }
     componentDidMount(){
    
    }
     **/

    render() {
        const {state,onClick,hidden} = this.props;
        console.log('render',1);
        return (
            <div className='load-more' onClick={(e)=>{
                switch(state){
                        case LOAD_FAILURE:
                        case LOAD_MORE:
                            onClick( state );
                            break;
                        default:
                            onClick(LOAD_MORE);
                    }
            }}
            style={hidden?{display:'none',...this.props.outStyle}:this.props.outStyle}>
                {(()=>{
                    switch(state){
                        case LOAD_FAILURE:
                            return '加载失败,点击重试';
                        case LOAD_MORE:
                            return '点击加载更多';
                        case NOT_MORE:
                            return '最后一页';
                        case LOADING:
                            return '加载中';
                        default:
                            return '点击加载更多';
                    }
                })()}
            </div>
        )
    }
}


LoadMore.propTypes = {
};
LoadMore.defaultProps = {};
export default LoadMore;