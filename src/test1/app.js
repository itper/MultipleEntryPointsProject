__webpack_public_path__ = '//local.itper.top:9130/';//必须是全局,不能写成window.__webpack_public_path__
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import test from 'test';
import test1 from 'test1';
import util from './util';
console.log(util.test());
console.log(test);
console.log(test1);
class App extends Component {
  componentDidMount() {
    require.ensure([], (require) => {
      let test = require('./test').default;
      console.log(test);
    }, 'testxxx')
  }
  
  render() {
    return (
      <div styleName="test">
        hello 1
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App/>, document.querySelector('#app'));