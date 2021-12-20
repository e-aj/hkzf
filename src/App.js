//导入路由
import { BrowserRouter as Router ,Route,Redirect} from 'react-router-dom'


//导入首页和城市选择两个组件（页面）
import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';

import HouseDetail from './pages/HouseDetail';

import Login from './pages/Login'
import Registe from './pages/Registe'

import AuthRoute from './components/AuthRoute'

function App() {
  return (
    <Router>
      <div className="App">
      {/* 项目跟组件
      <Button color='primary'>111</Button> */}

      {/* 默认路由匹配时 跳转到 /home 实现路由重定向首页 */}
      <Route path='/' exact render={() => <Redirect to="/home"/>}/>
      {/* 配置路由 */}
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <AuthRoute path="/map" component={Map} />
      <Route path="/login" component={Login}></Route>
      <Route path="/registe" component={Registe}></Route>

      {/* 房源详情的路由规则： */}
      <Route path='/detail/:id' component={HouseDetail}></Route>

      
    </div>

    </Router>
    
  );
}

export default App;
