import React,{Component} from 'react';
import { connect } from 'react-redux'
import NativeApi from '../../util/NativeApi';

class App extends Component{
    componentDidMount(){
        NativeApi.invoke(
            'updateTitle', {
                'text':'赶集资讯'
            }
        );
        NativeApi.registerHandler('back1', function (param, callback) {
            callback(null, {preventDefault: 1});
            window.history.go(-1);
            // setTimeout(function(){
            //     window.location.reload();
            // },90);
        });
    }
    constructor(props){
        super(props);
    }
    getChildContext() {
        return { urlQuery: this.props.location.query }
    }
    render(){console.log('render');
        const {children} = this.props;
        return(
            <div>
                {children}
            </div>
        )
    }
}

export default connect()(App);


App.childContextTypes={
    urlQuery:React.PropTypes.object
};