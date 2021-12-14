import React from 'react'

import { Flex } from 'antd-mobile'



// 导入搜索栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'

// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" 
                    onClick={()=>this.props.history.go(-1)}/>
                    <SearchHeader cityName={label} className={styles.searchHeader}/>
                </Flex>

                {/* 条件筛选 */}
                <Filter />

            </div>

            
        )
    }
}