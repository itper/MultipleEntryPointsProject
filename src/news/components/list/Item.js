import React, {Component,PropTypes} from 'react';
import CommonLink from './CommonLink';
import Lazyload from 'react-lazyload';

class Item extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(nextProps){
        if(this.props.data.images !== nextProps.data.images){
            this.setState({success:false});
        }

    }
    componentDidMount(){
        if(this.refs.img && this.refs.img.complete){
            this.setState({success:true});
        }
    }

    render(){
        const {data,url,lastItem} = this.props;
        const picCount =data.images.length;
        return(

            <CommonLink to={url}>
            <li className="news">
                        {
                            (()=>{
                                if(picCount===1){
                                    return (
                                        <div className={'new-content'}>
                                            <div className='pic-content'>
                                                <Lazyload height={63}>
                                                    <img src={data.images} ref='img' onError={()=>{
                                                        this.setState({success:false})
                                                    }} onLoad={()=>{
                                                        this.setState({success:true})
                                                    }}
                                                     style={this.state.success?{display:'block'}:{display:'none'}}
                                                    />
                                                </Lazyload>
                                            </div>

                                            <div className='content-txt'>
                                                <div className='title1'>{data.title}</div>
                                                <div className='title2'>
                                                    <div className="source">{data.source}</div>
                                                    <div className='date-n'>{data.create_time}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else if(data.images.length>1){
                                    return (
                                        <div className={'new-content '} style={{display:'block'}}>
                                            <div className="title1" style={{height:'auto',marginBottom:'12px',paddingLeft:0}}>
                                                {data.title}
                                            </div>
                                            <div className="grid" style={{display:'-webkit-box',WebkitBoxPack:'justify'}}>
                                            {
                                                data.images.map((url,index)=>{
                                                    return (
                                                        <div className={"pic-content" } key={index} style={{}}>
                                                            <Lazyload height={63}>
                                                                <img src={data.images[index]} ref='img' onError={()=>{
                                                                    this.setState({success:false})
                                                                }} onLoad={()=>{
                                                                    this.setState({success:true})
                                                                }}
                                                                 style={this.state.success?{display:'inline-block'}:{display:'none'}}
                                                                />
                                                            </Lazyload>
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>
                                            <div className='content-txt'>
                                                <div className='title2' style={{paddingLeft:0}}>
                                                    <div className="source">{data.source}</div>
                                                    <div className='date-n'>{data.create_time}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div className={'new-content '} style={{display:'block'}}>
                                            <div className="title1" style={{height:'auto',marginBottom:'12px',paddingLeft:0}}>
                                                {data.title}
                                            </div>
                                            <div className='content-txt'>
                                                <div className='title2' style={{paddingLeft:0}}>
                                                    <div className="source">{data.source}</div>
                                                    <div className='date-n'>{data.create_time}</div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                }
                            })()
                        }

                <p className='under-line'  style={(()=>{ if (lastItem){'margin-bottom:0;'}})()}/>
            </li>
            </CommonLink>
        )
    }
}
Item.propTypes = {
    data:PropTypes.object.isRequired,
    lastItem:PropTypes.bool
};
export default Item;