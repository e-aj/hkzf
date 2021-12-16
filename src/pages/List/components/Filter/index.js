import React, { Component } from 'react';

import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
// import { Spring } from 'react-spring/renderprops';

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

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
  }

class Filter extends Component {
    state = {
        titleSelectedStatus,
        openType: "",
        filtersData: {},
        selectedValues
    }

    componentDidMount() {
        this.bodyEl = document.body
        this.getFiltersData()
    }

    // 获取筛选条件
    async getFiltersData() {
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'));
        const res = await API.get(`/houses/condition?id=${value}`);

        this.setState({
            filtersData: res.data.body
        })
    }

    onTitleClick = (type) => {
        const { titleSelectedStatus, selectedValues } = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectecStatus = {...titleSelectedStatus};

        Object.keys(titleSelectedStatus).forEach(key => {
            if (key === type) {
                newTitleSelectecStatus[type] = true
                return
            }

            const selectedVal = selectedValues[key];
            if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
                newTitleSelectecStatus[key] = true
            } else if (key === 'mode' && selectedVal[0] !== 'null') {
                newTitleSelectecStatus[key] = true
            } else if (key === 'price' && selectedVal[0] !== 'null') {
                newTitleSelectecStatus[key] = true
            } else if (key === 'more' && selectedVal.length > 0) {
                newTitleSelectecStatus[key] = true
            } else {
                newTitleSelectecStatus[key] = false
            }
        })

        this.setState({
            titleSelectedStatus: newTitleSelectecStatus,
            openType: type
        })

        this.bodyEl.className = 'body-fixed'
    }

    // 隐藏对话框
    onCancel = (type) => {
        const { titleSelectedStatus, selectedValues } = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectecStatus = {...titleSelectedStatus};

        const selectedVal = selectedValues[type];
        if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
            newTitleSelectecStatus[type] = true
        } else if (type === 'mode' && selectedVal[0] !== 'null') {
            newTitleSelectecStatus[type] = true
        } else if (type === 'price' && selectedVal[0] !== 'null') {
            newTitleSelectecStatus[type] = true
        } else if (type === 'more' && selectedVal.length > 0) {
            newTitleSelectecStatus[type] = true
        } else {
            newTitleSelectecStatus[type] = false
        }

        this.setState({
            openType: "",
            titleSelectedStatus: newTitleSelectecStatus
        })

        this.bodyEl.className = ''
    }

    // 确定对话框
    onSave = (type, value) => {
        const { titleSelectedStatus } = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectecStatus = {...titleSelectedStatus};

        const selectedVal = value;
        if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
            newTitleSelectecStatus[type] = true
        } else if (type === 'mode' && selectedVal[0] !== 'null') {
            newTitleSelectecStatus[type] = true
        } else if (type === 'price' && selectedVal[0] !== 'null') {
            newTitleSelectecStatus[type] = true
        } else if (type === 'more' && selectedVal.length > 0) {
            newTitleSelectecStatus[type] = true
        } else {
            newTitleSelectecStatus[type] = false
        }

        const newSelectedValues = {
            ...this.state.selectedValues,
            [type]: value
        }

        const { area, mode, price, more } =newSelectedValues;

        // 筛选条件数据
        const filters = {}

        // 区域
        const areaKey = area[0];
        let areaValue = 'null';
        if (area.length === 3) {
            areaValue = area[2] !== 'null' ? area[2] : area[1]
        }
        filters[areaKey] = areaValue;

        // 方式和租金
        filters.mode = mode[0]
        filters.price = price[0]

        // 更多筛选条件 more
        filters.more = more.join(',')

        this.props.onFilter(filters)
        // console.log(filters)

        this.setState({
            openType: "",
            titleSelectedStatus: newTitleSelectecStatus,
            selectedValues: newSelectedValues
        })

        this.bodyEl.className = ''
    }
    
    onOk = () => {
        const {type,onSave} = this.props

        onSave(type,this.state.selectedValues)
    }

    renderFilterPicker() {
        const { 
            openType, 
            filtersData: {area, subway, rentType, price},
            selectedValues
         } = this.state;

        if (!openType || openType === 'more') return null;

        let arr = [], cols = 3, defaultValue = selectedValues[openType];
        switch (openType) {
            case 'area':
                arr = [area, subway];
                cols = 3
                break;
            case 'mode':
                arr = rentType;
                cols = 1
                break;
            case 'price':
                arr = price;
                cols = 1
                break;
            default:
                break;
        }

        return <FilterPicker 
                    key={openType}
                    onCancel={this.onCancel} 
                    onSave={this.onSave} 
                    data={arr} 
                    cols={cols} 
                    type={openType}
                    defaultValue={defaultValue}
                    />;
    }

    renderFilterMore() {
        const {
            openType,
            selectedValues,
            filtersData: { roomType, oriented, floor, characteristic }
        } = this.state

        if (openType !== 'more') return null;

        const data ={
            roomType,
            oriented,
            floor,
            characteristic
        }

        const defaultValue = selectedValues.more;

        return (
            <FilterMore 
                data={data} 
                type={openType} 
                onSave={this.onSave}
                onCancel={this.onCancel}
                defaultValue={defaultValue} 
                onOk={this.onOk}
                />
        );
    }


    render() {
        const { titleSelectedStatus } = this.state;

        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                
                {/* {
                    // 遮罩层
                    (openType === 'area' || openType === 'mode' || openType === 'price')
                        ? <div className={styles.mask} onClick={this.onCancel} />
                        : null
                } */}

                <div className={styles.content}>
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

                    { this.renderFilterPicker() }

                    { this.renderFilterMore() }
                </div>
            </div>
        )
    }
}

export default Filter;