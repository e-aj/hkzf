import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 导入组件库
import 'antd-mobile/dist/antd-mobile.css';

// 导入字体图标库
import './assets/fonts/iconfont.css'

// 导入react-virtualized样式
import 'react-virtualized/styles.css'

// 注意：应该将组件的导入放在样式导入后面  从而避免样式覆盖的问题
import App from './App';

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);
