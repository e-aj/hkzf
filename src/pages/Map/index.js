import React from 'react'
import './index.scss'


export default class Map extends React.Component {
    componentDidMount(){
        //初始化地图实例
        // 全局对象使用window
        const map = new window.BMapGL.Map('container')
        // 设置中心坐标
        const point = new window.BMapGL.Point(116.404, 39.915);
        // 初始化实例
        map.centerAndZoom(point, 15); 

    }

    render() {
        return(
            <div className="map">
                {/* 地图容器 */}
                <div id="container">

                </div>
            </div>
        )
    }
}