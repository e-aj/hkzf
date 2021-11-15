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
    color: 'rgb(255,255,255)',
    textAlign: 'center'

}


export default class Map extends React.Component {
    componentDidMount() {
        this.initMap()
    }
    // 初始化地图
    async initMap() {
        //初始化地图实例
        // 全局对象使用window
        const map = new BMapGL.Map('container')

        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, (point) => {
            if (point) {
                map.centerAndZoom(point, 11);
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            } else {
                alert('您选择的地址没有解析到结果！');
            }
            var labelq = new BMapGL.Label('', {       // 创建文本标注
                position: point,
                offset: new BMapGL.Size(-30, -35)
            })
            labelq.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}"> 111</p>
                    <p>99套</p>
                </div>
            `)
            map.addOverlay(labelq);                        // 将标注添加到地图中
            labelq.setStyle(labelStyle )                            // 设置label的样式
            labelq.addEventListener('click',()=>{
                console.log('111')
            })

        }, label)
        var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        map.addControl(scaleCtrl);
        var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        map.addControl(zoomCtrl);

        // const opts = {
        //     // position:point,
        //     offset: new BMapGL.Size(30,-30)
        // }
        // const labelq = new BMapGL.label('111',opts)

        // labelq.setStyle({
        //     color:'red'

        // })
        // map.addOverlay(labelq);  

         const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
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
                <div id="container" className={styles.container}>
                </div>
            </div>
        )
    }
}