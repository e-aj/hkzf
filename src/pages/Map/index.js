import React from 'react'
// import axios from 'axios'
import styles from './index.module.css'
import { Toast } from 'antd-mobile'

// 导入BASE_URL
import { BASE_URL } from '../../utils/url'
// 
import {API} from '../../utils/api'

// 导入封装好的NavHeader组件
import NavHeader from '../../components/NavHeader';

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL

const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255,0,0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    // color: 'rgb(255,255,255)',
    // textAlign: 'center'

}


export default class Map extends React.Component {
    state = {
        // 小区下的房源列表
        housesList: [],
        isShowList: false
    }
    componentDidMount() {
        this.initMap()
    }
    // 初始化地图
    initMap() {
        //初始化地图实例
        // 全局对象使用window
        const map = new BMapGL.Map('container')
        this.map = map

        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async (point) => {
            if (point) {
                map.centerAndZoom(point, 11);
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);
                this.renderOverlays(value)
                // const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                // res.data.body.forEach(item => {
                //    
                //    
                // });
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)

        // 给地图绑定移动事件
        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }

        })
    }




    async renderOverlays(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)
            const res = await API.get(`/area/map?id=${id}`)
            // 关闭loading
            Toast.hide()
            const data = res.data.body

            // 调用getTypeAndZoom
            const { nextZoom, type } = this.getTypeAndZoom()
            data.forEach(item => {
                // 创建覆盖物
                this.creatOverlays(item, nextZoom, type)
            })
        } catch (e) {
            // 关闭loading
            Toast.hide()
        }

    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    getTypeAndZoom() {
        // 调用地图
        const zoom = this.map.getZoom()
        let nextZoom, type
        // console.log(zoom)
        if (zoom >= 10 && zoom < 12) {
            // 区

            // 下一个缩放级别
            nextZoom = 13
            type = 'circle'
        } else if (zoom >= 13 && zoom < 14) {
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // nextZoom = 20
            type = 'rect'
        }
        return {
            nextZoom,
            type
        }
    }

    // 创建覆盖物
    creatOverlays(data, zoom, type) {
        const { coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建地图坐标
        const areaPoint = new BMapGL.Point(longitude, latitude)

        if (type === 'circle') {
            // 区或镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建区，镇覆盖物
    createCircle(point, name, count, id, zoom) {
        // 创建覆盖物
        var content = 'label';

        const label = new BMapGL.Label(content, {
            position: point,
            offset: new BMapGL.Size(-35, -35)
        })

        // 给label对象添加唯一标识
        label.id = id

        // 设置覆盖物样式
        // console.log(name, count)
        label.setContent(`
                        <div class="${styles.bubble}">

                        <p class="${styles.name}">${name}</p>
                        <p>${count}套</p>

                        </div>
                    `)
        label.setStyle(labelStyle)


        label.addEventListener('click', () => {
            // 调用renderOverlays方法
            this.renderOverlays(id)

            // 放大地图
            this.map.centerAndZoom(point, zoom)

            // 清除当前覆盖物信息
            this.map.clearOverlays()
        })
        this.map.addOverlay(label);                        // 将标注添加到地图中
    }

    // 创建小区覆盖物
    createRect(point, name, count, id) {
        // 创建覆盖物
        var content = 'label';

        const label = new BMapGL.Label(content, {
            position: point,
            offset: new BMapGL.Size(-50, -28)
        })

        // 给label对象添加唯一标识
        label.id = id

        // 设置覆盖物样式
        label.setContent(`
                        <div class="${styles.rect}">
                            <p >${name}${count}套</p>
                        </div>
                    `)
        label.setStyle(labelStyle)


        label.addEventListener('click', (e) => {
            this.getHousesList(id)
            console.log(e)
            // 获取当前被点击项
            // const target = e.changedTouches[0]
            // console.log(target)
        })
        this.map.addOverlay(label);                        // 将标注添加到地图中
    }

    // 获取小区房源数据
    async getHousesList(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)
            const res = await API.get(`houses?cityId=${id}`)
            // 关闭loading
            Toast.hide()
            this.setState({
                housesList: res.data.body.list,
                isShowList: true

            })

        } catch (e) {
            // 关闭loading
            Toast.hide()
        }


    }

    // 封装渲染房屋列表的方法
    renderHousesList() {
        return this.state.housesList.map(item =>
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={`${BASE_URL}${item.houseImg}`}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {item.title}
                    </h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {
                            item.tags.map((tag, index) => {
                                const tagClass = 'tag' + (index + 1)
                                return (
                                    <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
                                        {tag}
                                    </span>
                                )
                            }

                            )
                        }
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>{item.price}</span> 元/月
                    </div>
                </div>
            </div>)


    }

    render() {
        return (
            <div className={styles.map}>
                {/* 顶部导航栏 */}
                <NavHeader>
                    地图找房
                </NavHeader>
                {/* 地图容器 */}
                <div id="container" className={styles.container}>

                </div>
                {/* 房源列表 */}
                <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <a className={styles.titleMore} href="/house/list">
                            更多房源
                        </a>
                    </div>
                    <div className={styles.houseItems}>
                        {this.renderHousesList()}

                    </div>
                </div>
            </div>
        )
    }
}
