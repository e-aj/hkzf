import React from "react";
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// import axios from "axios";
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import './index.scss'

// 导入BASE_URL
import { BASE_URL } from '../../utils/url'
//
// 导入axios实例
import {API} from '../../utils/api'

import { getCurrentCity} from '../../utils'

// 导航菜单数据
const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/home/list'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/home/list'
    },
]

// 1.打开百度地图JS API 定位文档
// 2.通过IP定位获取当前城市名称
// 3.调用服务器接口，换区项目城市信息
// 4.将接口返回的数据信息展示在顶部导航栏中


export default class Index extends React.Component {
    state = {
        //轮播图状态数据
        swipers: [],
        isSwiperLoaded: false,
        //租房小组数据
        groups: [],
        news: [],
        curCityName:'上海'
    }

    //获取轮播图数据的方法
    async getSwipers() {
        const res = await API.get('/home/swiper')
        this.setState({
            swipers: res.data.body,
            isSwiperLoaded: true
        })
    }

    //获取租房小组的数据的方法
    async getGroups() {
        const res = await API.get('/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            groups: res.data.body
        })

    }
    // 获取最新咨询
    async getNews() {
        const res = await API.get('/home/news', {
            params: {
                area: 'AREA|88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            news: res.data.body

        })
    }


    async componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        // const curCity = new window.BMapGL.LocalCity();
        // curCity.get(async res => {
        //     // console.log(res)
        //     const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
        //     console.log(result)
        //     this.setState({
        //         curCityName:result.data.body.label
        //     })
        // })
        const curCity = await getCurrentCity()
        console.log(curCity)
        this.setState({
            curCityName : curCity.label
        })
        
    }



    //渲染轮播图结构
    renderSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={`${BASE_URL}${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                    }}
                />
            </a>

        ))
    }

    // 渲染导航菜单
    renderNavs() {
        return navs.map(item => (
            <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
                <img src={item.img} alt='' />
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    // 渲染最新咨询
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img className="img" src={`${BASE_URL}${item.imgSrc}`} />
                </div>

                <Flex className="content" direction="colum" justify="between">
                    <h3 className="title"> {item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>

                </Flex>
            </div>

        ))


    }

    render() {
        return (
            <div>
                {/* 轮播图 */}
                {
                    this.state.isSwiperLoaded ? (
                        <Carousel autoplay={true} infinite autoplayInterval={3000}>
                            {this.renderSwipers()}
                        </Carousel>
                    ) : ('')
                }


                {/* 搜索框 */}
                <Flex className="search-box">
                    {/* 左侧白色区域 */}
                    <Flex className="search">
                        {/* 位置 */}
                        <div className="location" onClick={()=> this.props.history.push('/citylist')}>
                            <span className="name">{this.state.curCityName}</span>
                            <i className="iconfont icon-arrow"></i>

                        </div>
                        {/* 搜索表单 */}
                        <div className="form" onClick={()=> this.props.history.push('/search')}>
                            <i className="iconfont icon-seach"></i>
                            <span className="text">请输入小区或地址</span>
                        </div>
                    </Flex>
                    {/* 右侧地图图标 */}
                    <i className="iconfont icon-map" onClick={()=> this.props.history.push('/map')}></i>
                </Flex>

                {/* 导航菜单 */}
                <Flex className='nav'>
                    {this.renderNavs()}
                </Flex>

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">租房小组<span className="more">更多</span></h3>
                    <Grid data={this.state.groups} square={false} columnNum="2" square={false} hasLine={false} renderItem={(item) =>
                        <Flex className="group-item" justify="around" key={item.id}>
                            <div className="desc">
                                <p className="title">{item.title}</p>
                                <p className="info">{item.desc}</p>
                            </div>
                            <img
                                src={`${BASE_URL}${item.imgSrc}`}
                                alt=""
                            />
                        </Flex>
                    } />
                </div>

                {/* 最新咨询 */}
                <div className="news">
                    <h3 className="group-title">最新咨询</h3>
                    <WingBlank size="md" className="news-content">{this.renderNews()}</WingBlank>

                </div>
            </div>

        );
    }
}