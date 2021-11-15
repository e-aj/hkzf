import React from 'react'
import { NavBar } from 'antd-mobile'
// import "./index.scss"
import styles from "./index.module.css"

// 导入withRouter高阶组件
import { withRouter } from 'react-router-dom'

// 导入prop校验的包
import PropTypes from 'prop-types'

 function NavHeader({ children, history,onLeftClick}) {
    // 默认点击行为
    const defaultHandler = () => history.go(-1)

    return (
        <NavBar
            className={styles.navbar}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandler}
        >{children}</NavBar>
    )
}

// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func

}

export default withRouter(NavHeader)