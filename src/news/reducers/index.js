import { routerReducer as routing } from 'react-router-redux'
import * as ActionStateAndType from '../actions';
import {combineReducers} from 'redux';

var def = {
        title:[
            {title:'推荐',value:'recomm'},
            {title:'本地',value:'local'},
            {title:'搞笑',value:'joke'},
            {title:'社会',value:'hot'},
            {title:'汽车',value:'auto'},
            {title:'八卦',value:'ent'},
            {title:'房产',value:'house'}
        ],
    loading:true,
    loadState:ActionStateAndType.START_LOAD_NEWS
};
function reducer(state=def,action){
    switch (action.type){
        case ActionStateAndType.FAILURE_LOAD_NEWS:
            return {
                ...state,
                message:action.data.errormsg,
                loadState:ActionStateAndType.FAILURE_LOAD_NEWS,
                actionType:action.actionType

            };
        case ActionStateAndType.START_LOAD_NEWS:
            return {
                ...state,
                loadState:ActionStateAndType.START_LOAD_NEWS,
                actionType:action.actionType

            };
        case ActionStateAndType.SUCCESS_LOAD_NEWS:
            state.data=state.data||[];
            if(!action.loadMore){
                state.data=[];
            }
            return {
                ...state,
                loadState:ActionStateAndType.SUCCESS_LOAD_NEWS,
                data:state.data.concat(action.data),
                actionType:action.actionType
            };
        return state;
    }
    if(action.data){
        return Object.assign(...state,action.data);
    }
    return state;
}
const rootReducer = combineReducers({
    reducer,
    routing
});

export default rootReducer;