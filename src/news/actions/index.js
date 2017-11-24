export const START_LOAD_NEWS = 'start-load-news';
export const SUCCESS_LOAD_NEWS = 'success-load-news';
export const FAILURE_LOAD_NEWS = 'failure-load-news';
export const ACTION_TYPE_PULL_TO_REFRESH = 'pull-to-refresh';
export const ACTION_TYPE_LOAD_MORE = 'load-more';
export const ACTION_TYPE_REFRESH = 'refresh';
import  qs  from 'qs';
import axios from 'axios';
const testHeader =  {
    'customerId': '801',
    'clientAgent': 'iphone#320*480',
    'GjData-Version': '6.0.0',
    'versionId': '6.0.0',
    'model': 'Generic/iphone',
    'contentformat': 'json2',
    'userId': 'AB2CF15DC6A693DCC4BC3416F6B8F1EB',
    'token': '5170554a5868544d69564e6c2b35387351704c356a4d5559',
    'mac': '8A4F3DB8-F71E-4343-95B8-E249E790DDE3',
    'X-Ganji-Token':'30346d523130345572664d2f433231313034542f32656a77',
    'X-Ganji-CustomerId':'801',
    'X-Ganji-InstallId':'BE83217369A16664CD7828E24D1485A0',
    'X-Ganji-VersionId':'6.0.0',
    'X-Ganji-ClientAgent':'samsung/GT-I9500#1080*1920#3.0#4.4.2'
};
var host = (typeof window === ''+void 0 )?'http://app.dns.ganji.com':'//mobds.ganji.cn';console.log(host);
const api = {loadNews:host+'/api/v1/msc/v1/common/information/v2/list'
}
function loadNewsOver(actionType,json,loadMore){
    return {
        type:json.errorno===0?SUCCESS_LOAD_NEWS:FAILURE_LOAD_NEWS,
        loadMore:loadMore,
        data:json.data?json.data.idlist[0]:[],
        actionType
    }
}
export default function loadNews(actionType,type,page,pageSize=20){
    return async (dispatch)=>{
        dispatch({type:START_LOAD_NEWS,actionType:actionType});
        const url = api.loadNews+'?'+qs.stringify({
                scene:'category',
                category_id:'9',
                from:'appindex',
                tabid:type,
                city_id:'12',
            });
        try{
            const json = (await axios.get(url,{headers:testHeader})).data;
            dispatch(loadNewsOver(actionType,json,page!==0));
        }catch(e){
            dispatch(loadNewsOver(actionType,{errorno:1},page!==0));
        }
    }
}
export function refresh(type){

}