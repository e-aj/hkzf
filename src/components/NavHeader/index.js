import React from 'react';
import { withRouter } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import PropTypes from 'prop-types';

import styles from './index.module.css';

function NavHeader(props) {
    const defaultHandler = () => props.history.go(-1);

    return (
        <NavBar
            className={[styles.navBar, props.className || ''].join(' ')}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={props.onLeftClick || defaultHandler}
            rightContent={props.rightContent}
            >
            {props.children}
        </NavBar>
    )
}

// 校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
    className: PropTypes.string,
    rightContent: PropTypes.array
}

export default withRouter(NavHeader)