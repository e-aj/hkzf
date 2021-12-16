import React from 'react';
import { Flex, Toast } from 'antd-mobile';
import { API } from '../../utils/api';
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';

import SearchHeader from '../../components/SearchHeader';
import HouseItem from '../../components/HouseItem';
import Sticky from '../../components/Sticky';
import NoHouse from '../../components/NoHouse';
import Filter from './components/Filter';

import { BASE_URL } from '../../utils/url';
import { getCurrentCity } from '../../utils';

import styles from "./index.module.css";

/* 在组件外部的代码只会在项目加载时执行一次。在切换路由时不会重新执行，所以这里的代码只会执行一次 */
// const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));

class HouseList extends React.Component {
    state = {
        list: [],
        count: 0
    }

    // 初始化数据
    filters = {}
    label = '定位中...'
    value = ''

    async componentDidMount() {
        const { label, value } = await getCurrentCity()
        this.label = label
        this.value = value

        this.searchHouseList()
    }

    // 获取房屋列表数据
    async searchHouseList() {
        Toast.loading('加载中...', 0, null, false)
        const res = await API.get('/houses', {
            params: {
                cityId: this.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        const { list, count } = res.data.body;

        Toast.hide()

        if (count !== 0) {
            Toast.info(`共找到${count}套房源`, 2, null, false)
        }

        this.setState({
            list,
            count
        })
    }

    // 判断列表中的每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    }

    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(resolve => {
            API.get('/houses', {
                params: {
                    cityId: this.value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex
                }
            }).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list]  // 合并数据
                })

                // 数据加载完，调用 resolve 即可
                resolve()
            })
        })
    }

    // 接收filter筛选条件数据
    onFilter = filters => {
        window.scrollTo(0, 0)
        this.filters = filters;
        
        this.searchHouseList()
    }

    rowRenderer = ({ key, index, style }) => {
        const { list } = this.state;
        const house = list[index];

        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}></p>
                </div>
            )
        }

        return (
            <HouseItem
                key={key}
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
                onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
                 />
        );
    }

    // 渲染列表数据
    renderList() {
        const { count } = this.state;

        if (count === 0) return <NoHouse>~没有找到房源，请您换个搜索条件吧~</NoHouse>;

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({onRowsRendered, registerChild}) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        autoHeight  // 设置 WindowScroller 最终渲染的列表高度
                                        width={width}  // 视口的宽度
                                        height={height}  // 视口的高度
                                        rowCount={count}  // 列表项的行数
                                        rowHeight={120}  // 每一行的高度
                                        rowRenderer={this.rowRenderer}  // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    /> 
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }

    render() {
        return (
            <div>
                {/* 顶部导航栏 */}
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchHeader className={styles.searchHeader} cityName={this.label}></SearchHeader>
                </Flex>

                {/* 条件筛选栏 */}
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter} />
                </Sticky>

                {/* 房屋列表 */}
                <div className={styles.houseItems}>{this.renderList()}</div>
            </div>
        )
    }
}

export default HouseList;