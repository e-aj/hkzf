import React from 'react'

// 导入搜索栏组件
import SearchHeader from '../../components/SearchHeader'

// 获取当前定位城市信息
const {label} = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component{
    render() {
        return (
            <div>
                <SearchHeader cityName={label} />
            </div>
        )
    }
}