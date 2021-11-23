import React from 'react'
import axios from 'axios'
import styles from './index.module.css'

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
    }




    async renderOverlays(id) {
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
        const data = res.data.body

        // 调用getTypeAndZoom
        const { nextZoom, type } = this.getTypeAndZoom()
        data.forEach(item => {
            // 创建覆盖物
            this.creatOverlays(item, nextZoom, type)
        })
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


        label.addEventListener('click', () => {
            this.getHousesList(id)
        })
        this.map.addOverlay(label);                        // 将标注添加到地图中
    }

    // 获取小区房源数据
    async getHousesList(id){
       const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
       console.log(res)

    }

    render() {
        return (
            <div className={styles.map}>
                {/* 顶部导航栏 */}
                <NavHeader>
                    地图找房
                </NavHeader>
                {/* 地图容器 */}
                <div id="container" className={styles.container}></div>

                <div className={styles.houseList}></div>
            </div>
        )
    }
}