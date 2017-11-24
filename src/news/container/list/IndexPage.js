import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TabBar from '../../components/list/TabBar';
import List from '../../components/list/List';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import loadNews, * as ActionStateAndType from '../../actions';
import  Loading, * as LoadingState from '../../components/list/Loading';
import LoadMore, {LOAD_FAILURE, LOADING, LOAD_MORE} from '../../components/list/LoadMore';
import PullToRefresh from '../../components/list/PullToRefresh';
import OpenApp from '../../components/list/OpenApp';
import Header from '../../components/list/Header';
import NativeApi from '../../util/NativeApi';
function loadData(props) {
}
class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.isNewPage = false;
        this.state = {};
        this.currentPage = 0;
    }

    componentWillMount() {
        if (this.props.list.length === 0)
            IndexPage.fillStore(this.context.store, this.props.params)
    }

    static fillStore(store, query) {
        return store.dispatch(loadNews(ActionStateAndType.ACTION_TYPE_REFRESH,query.tab, 1));
    }
    componentDidMount(){
        setTimeout(function(){
            document.getElementsByTagName('body')[0].scrollTop = 0;
        },10);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.tab !== nextProps.params.tab) {
            this.currentPage = 0;
            this.isNewPage = true;
            var selected = nextProps.params.tab;
            this.props.loadNewsAction(ActionStateAndType.ACTION_TYPE_REFRESH,selected, 0)
        }
    }

    componentDidUpdate() {
        if (this.isNewPage) {
            this.isNewPage = false;
            setTimeout(function() {
                document.getElementsByTagName('body')[0].scrollTop = 0;
            },10);
        }
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return !(this.props.params.tab !== nextprops.params.tab);
    }

    render() {
        const {title, loadState, actionType, list} = this.props;
        var selected = this.props.params.tab || title[0].value;
        let inApp = this.props.location.query.inApp!=='1';
        let href = (typeof window===''+void 0 || typeof window.location===''+void 0)?('http://wssta.ganji.com'+this.props.location.pathname+this.props.location.search):window.location.href;
        return (
            <div>
                <div style={{display:inApp?'none':'block'}}>
                    <Header />
                </div>
                <TabBar items={title} selected={selected} top={inApp?'0':'45px'}/>
                <Loading state={getState(ActionStateAndType.ACTION_TYPE_REFRESH,actionType,loadState)}/>
                <div id="wrapper" ref="toTop" style={{marginTop:inApp?'45px':'90px'}}>

                    <div
                        style={{display:inApp?'none':'block'}}
                    >

                        <OpenApp
                            tab={selected}
                            pageType="list"
                            position="bottom"
                            arg="http://ganji.cn/t/Hj9A1O"
                            url="http://ganji.cn/t/Hj9A1O"
                            name="urlToNativePage"
                            rootUrl="http://sta.ganji.com/att/project/touch/download_app/index.html?"
                            root_url="http://sta.ganji.com/att/project/touch/download_app/index.html?"
                            paramUrl={'ganji://h5page?data={"url":"h5page","cParam":{"fromurl":"' + href + '","from":"informationdetail"},"bParam":{"url":"' + href.replace('inApp=1','inApp=0') + '"}}'}
                            param_url={'ganji://h5page?data={"url":"h5page","cParam":{"fromurl":"' + href + '","from":"informationdetail"},"bParam":{"url":"' + href.replace('inApp=1','inApp=0') + '"}}'}
                            role="link"
                            gjalog="100000002075000100000010"
                            onClose={(isClose)=>{
                                console.log(isClose);
                                this.setState({...this.state,isClose});
                            }}
                        />
                    </div>
                    <PullToRefresh
                        onRefresh={()=>{
                            var selected = this.props.params.tab;
                            this.currentPage = 0;
                            this.props.loadNewsAction(ActionStateAndType.ACTION_TYPE_PULL_TO_REFRESH,selected,this.currentPage);
                        }}
                        isLoading={getState(ActionStateAndType.ACTION_TYPE_PULL_TO_REFRESH,actionType,loadState)||false}
                    >
                        <div className="iScroller">
                            <List selected={selected} list={list}/>
                            <LoadMore
                                outStyle={!this.state.isClose?(inApp?{}:{'paddingBottom':'.45rem'}):{}}
                                state={getState(ActionStateAndType.ACTION_TYPE_LOAD_MORE,actionType,loadState)}
                                onClick={()=>{
                                    var selected = this.props.params.tab;
                                    this.currentPage+=1;
                                    this.props.loadNewsAction(ActionStateAndType.ACTION_TYPE_LOAD_MORE,selected,this.currentPage);
                                }}/>
                        </div>
                    </PullToRefresh>
                </div>
            </div>
        )
    }
}
function getState(currentActionType,actionType,loadState){
    if(currentActionType!==actionType){
        return;
    }
    if(actionType===ActionStateAndType.ACTION_TYPE_REFRESH){
        if(loadState===ActionStateAndType.START_LOAD_NEWS){
            return LoadingState.LOADING;
        }else if(loadState===ActionStateAndType.SUCCESS_LOAD_NEWS){
            return '';
        }else if(loadState===ActionStateAndType.FAILURE_LOAD_NEWS){
            return LoadingState.OFFLINE;
        }
    }
    if(actionType===ActionStateAndType.ACTION_TYPE_LOAD_MORE){
        if(loadState===ActionStateAndType.SUCCESS_LOAD_NEWS){
            return LOAD_MORE;
        }else if(loadState===ActionStateAndType.FAILURE_LOAD_NEWS){
            return LOAD_FAILURE;
        }else if(loadState===ActionStateAndType.START_LOAD_NEWS){
            return LOADING;
        }
    }
    if(actionType===ActionStateAndType.ACTION_TYPE_PULL_TO_REFRESH){
        if(loadState===ActionStateAndType.SUCCESS_LOAD_NEWS){
            return false;
        }else if(loadState===ActionStateAndType.FAILURE_LOAD_NEWS){
            return false;
        }else if(loadState===ActionStateAndType.START_LOAD_NEWS){
            return true;
        }
    }
}
function mapStateToProps(state) {
    const {reducer} = state;
    return {
        title: reducer.title,
        list: reducer.data ? reducer.data : [],
        actionType: reducer.actionType,
        data: reducer.data,
        loadState: reducer.loadState
    }
}
IndexPage.contextTypes = {
    store: React.PropTypes.object
};
function mapDispatchToProps(dispatch) {
    return {
        loadNewsAction: bindActionCreators(loadNews, dispatch)
    }
}
function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IndexPage);