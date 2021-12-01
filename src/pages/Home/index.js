import React from "react";
//导入路由
import {  Route} from 'react-router-dom'

import { TabBar } from 'antd-mobile';

import './index.css'
//导入News组件
import Index from "../Index";
import List from "../List";
import News from "../News";
import profile from "../Profile";



//Tabar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    // 控制默认选项
    selectedTab: this.props.location.pathname,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      //此时路由发生切换
      this.setState({
        selectedTab:this.props.location.pathname
      })
    }
  }

  // 渲染TabBar.Item
  renderTabBarItem() {
    return tabItems.map(item => <TabBar.Item
      title={item.title}
      key={item.title}
      icon={<i className={`iconfont ${item.icon}`}></i>}
      selectedIcon={<i className={`iconfont ${item.icon}`}></i>
      }
      selected={this.state.selectedTab === item.path}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });

        //路由切换
        this.props.history.push(item.path)
      }}
    />)
  }


  render() {
    return (
      <div className='home' >
        {/* 渲染子路由 */}

        <Route exact path='/home' component={Index}></Route>
        <Route path='/home/list' component={List}></Route>
        <Route path='/home/news' component={News}></Route>
        <Route path='/home/profile' component={profile}></Route>


        <TabBar
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
          {this.renderTabBarItem()}

        </TabBar>
      </div>


    )
  }

}


