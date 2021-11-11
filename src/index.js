import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'antd-mobile/dist/antd-mobile.css';

// 导入字体图标库
import './assets/fonts/iconfont.css'

// 导入react-virtualized样式
import 'react-virtualized/styles.css'

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);
