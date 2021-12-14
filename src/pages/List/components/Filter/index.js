import React, { Component } from 'react';

import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
// import { Spring } from 'react-spring/renderprops';
import { Spring } from 'react-spring'

import { API } from "../../../../utils/api";

import styles from './index.module.css';


// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false
}

export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        // 控制filterPicker 或 FilterMore 组件的展示或隐藏
        openType: ''
    }

    onTitleClick = Type => {
        this.setState(prevState => {
            return {
                titleSelectedStatus: {
                    ...prevState.titleSelectedStatus,
                    [Type]: true

                }
            }

            // openType:type

            
        })
    }

    // 取消
    onCancel = () => {
        this.setState({
            openType:""
        })

    }

    // 确定
    onSave = () => {
        this.setState({
            openType:""
        })
    }

    render() {
        const { titleSelectedStatus, openType } = this.state

        return (
            <div className={styles.root}>

                {
                    (openType === 'area' || openType === 'mode' || openType === 'price')
                        ? <div className={styles.mask} />
                        : null
                }

                
                <div className={styles.content}>
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

                </div>

                {
                    openType === 'area' || 
                    openType === 'mode' ||
                    openType === 'price' ? (
                        <FilterPicker onCancel={this.onCancel} onSave={this.onSave}/>
                    ) : null}
                
            </div>







        )
    }
}