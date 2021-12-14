import React, { Component } from 'react';

import FilterFooter from '../../../../components/FilterFooter';

import styles from './index.module.css';

class FilterMore extends Component {
    state = {
        selectedValues: this.props.defaultValue
    }

    onTagClick(value) {
        const { selectedValues } = this.state;
        const newArr = [...selectedValues];

        if (!newArr.includes(value)) {
            newArr.push(value)
        } else {
            const index = newArr.findIndex(item => item === value);
            index !== -1 && newArr.splice(index, 1)
        }

        this.setState({
            selectedValues: newArr
        })
    }

    onCancel = () => {
        this.setState({
            selectedValues: []
        })
    }

    onOk = () => {
        const { type, onSave } = this.props;
        onSave(type, this.state.selectedValues);
    }

    renderFilters(data) {
        // 高亮类名：styles.tagActive
        return (
            data.map(item => {
                const isSelected = this.state.selectedValues.includes(item.value);

                return (
                    <span 
                        key={item.value} 
                        className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')} 
                        onClick={() => this.onTagClick(item.value)}>
                        {item.label}
                        </span>
                )
            })
        )
    }

    render() {
        const {
            onCancel,
            type,
            data: {roomType, oriented, floor, characteristic}
        } = this.props

        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                <div className={styles.mask} onClick={() => onCancel(type)}></div>

                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
                    </dl>
                </div>

                <FilterFooter 
                    className={styles.footer} 
                    cancelText="清除"
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                     />
            </div>
        )
    }
}

export default FilterMore;