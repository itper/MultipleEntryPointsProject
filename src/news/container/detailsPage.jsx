import React , { Component } from 'react';
import Banner from '../components/AppBanner';
import DetailsInfo from '../components/DetailsInfo';
import DetailsContent from '../components/DetailsContent';
import  Loading, * as LoadingState from '../components/list/Loading';
import axios from 'axios';
import DetailsBanner from '../components/DetailsBanner';
import List from '../components/List';
import {asyncRequestDetail} from '../util/actions';
import Header from '../components/list/Header';
import OpenApp from '../components/list/OpenApp';


class DetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {data:window.__SERVER_RENDER_DATA__?(window.__SERVER_RENDER_DATA__.data):(props.params.data?props.params.data.data:null)};
        window.__SERVER_RENDER_DATA__ = null;
    }
    shouldComponentUpdate(nextprops, nextstate) {
        return !(this.props.params.newsid !== nextprops.params.newsid);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.params.newsid !== nextProps.params.newsid){
            this.update(nextProps);
        }

    }
        componentDidMount(){
        if(this.state.data){
            return;
        }
        this.update(this.props);
    }
    componentDidUpdate(){
        document.getElementsByTagName('body')[0].scrollTop=0;
    }
    update(t){

        var request = {
            url : 'http://mobds.ganji.cn/api/v1/msc/v1/common/news/v2/detail?location=0&coordinate=1&city_id=1&user_id=0&newsid='+t.params.newsid+'&tabid='+t.params.tabid,
            headers: {
                'Content-Type':'application/json',
                'X-Ganji-CustomerId':'801',
                'X-Ganji-VersionId':'6.0.0',
                'X-Ganji-InstallId':'BE83217369A16664CD7828E24D1485A0',
                'X-Ganji-ClientAgent':'sdk#320*480',
                'X-Ganji-Agency':'agencydefaultid',
                'X-Ganji-token':'625041364b4370596363785434634576625043543561564f',
                'interface':'InformationList'
            }
        };
        axios.get(request.url,{headers:request.headers})
            .then((data)=>{
                this.setState({data:data.data.data});
            });
    }
    render() {
        var paramsData = this.state.data?this.state.data:null;
        let inApp = this.props.location.query.inApp!=='1';
        let href = (typeof window===''+void 0 || typeof window.location===''+void 0)?('http://wssta.ganji.com'+this.props.location.pathname+this.props.location.search):window.location.href;

        return (
            <div>
                <div style={{display:inApp?'none':'block'}}>
                    <Header />
                </div>
                <div
                    style={{display:inApp?'none':'block',marginTop:'45px'}}
                >

                    <OpenApp
                    tab={paramsData?paramsData.category:''}
                    pageType="detail"
                        arg="http://ganji.cn/t/Hj9A1O"
                        url="http://ganji.cn/t/Hj9A1O"
                        name="urlToNativePage"
                        rootUrl="http://sta.ganji.com/att/project/touch/download_app/index.html?"
                        root_url="http://sta.ganji.com/att/project/touch/download_app/index.html?"
                        paramUrl={'ganji://h5page?data={"url":"h5page","cParam":{"fromurl":"' + href + '","from":"informationdetail"},"bParam":{"url":"' + href.replace('inApp=1','inApp=0') + '"}}'}
                        param_url={'ganji://h5page?data={"url":"h5page","cParam":{"fromurl":"' + href + '","from":"informationdetail"},"bParam":{"url":"' + href.replace('inApp=1','inApp=0') + '"}}'}
                        role="link"
                        gjalog="100000002075000100000010"
                    />
                </div>
                <Loading state={(paramsData)?'':LoadingState.LOADING}/>
            <section className="detail">
                {
                    (()=>{
                        if(!paramsData){
                          return (
                              <div></div>
                          )
                        }
                        return (
                            <div>

                                <div style={{marginTop:inApp?'0':'45px'}}>
                                    <DetailsInfo title={paramsData.title} source={paramsData.source} create_time={paramsData.create_time}></DetailsInfo>
                                    <DetailsContent content={paramsData.content}></DetailsContent>
                                    <DetailsBanner version={paramsData.version} jump_text={paramsData.jump_text} major_category_id={paramsData.major_category_id}></DetailsBanner>
                                    <List list={paramsData.relate} category={paramsData.category}></List>
                                </div>
                            </div>
                        )
                    })()
                }
            </section>

            </div>
        );
    }

}

export default DetailsPage;