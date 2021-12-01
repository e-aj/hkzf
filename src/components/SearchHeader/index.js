import React from 'react'
import { Flex } from 'antd-mobile'
import './index.scss'
import {withRouter} from 'react-router-dom'

import PropTypes from 'prop-types'
 function SearchHeader({history,cityName}) {
    return(
        //   {/* 搜索框 */}
          <Flex className="search-box">
          {/* 左侧白色区域 */}
          <Flex className="search">
              {/* 位置 */}
              <div className="location" onClick={()=> this.props.history.push('/citylist')}>
                  <span className="name">{cityName}</span>
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

    )
}

// 添加属性校验
SearchHeader.propTypes = {
    cityName:PropTypes.string.isRequired
}

export default withRouter(SearchHeader)