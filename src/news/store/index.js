import {createStore,applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// import api from '../middleware/api';
import rootReducer from '../reducers/index';
// import DevTools from '../containers/DevTools';

export default function configureStore(preloaderState){
    const store = createStore(
        rootReducer,
        preloaderState,
        compose(
            applyMiddleware(thunk),
            // DevTools.instrument()
        )
    );
    if(module.hot){
        module.hot.accept('../reducers',()=>{
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}















