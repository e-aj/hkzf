import React from "react";
import './index.scss'
import { Toast } from 'antd-mobile';
import axios from "axios";
import { getCurrentCity } from '../../utils'
// import { List } from "react-virtualized";
import { AutoSizer, List } from 'react-virtualized';
import NavHeader from "../../components/NavHeader";


// 数据格式化的方法
// list:[{},{}]
const formatCityData = (list) => {
    const cityList = {}
    // const cityIndex = []
    // 1 遍历list数组
    // 2 获取每一个城市的首字母
    // 3 判断cityList中是否有分类

    list.forEach(item => {
        const first = item.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(item)
        } else {
            cityList[first] = [item]
        }

    })
    // 获取索引
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

// 封装处理索引的方法
const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50

const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cityIndex: [],
            cityList: {},
            activeIndex: 0
        }

        // 创建ref对象
        this.cityListComponent = React.createRef()

    }

    async componentDidMount() {
        await this.getCityList()

        // 调用measureAllRows 提前计算List 中每一行的高度  实现scrllToRow的精确跳转
        // 注意：调用这个方法时  保证list有数据
        this.cityListComponent.current.measureAllRows()
    }

    // 获取城市列表的方法
    async getCityList() {
        // 获取所有数据
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        // console.log(res)
        const { cityList, cityIndex } = formatCityData(res.data.body)

        // 1 获取热门城市数据
        // 2 将数据添加到cityList中
        // 3 将索引添加到cityIndex中
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        // console.log(hotRes)
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')

        // 获取当前城市
        const curCity = await getCurrentCity()
        cityList['#'] = [curCity]
        cityIndex.unshift('#')
        console.log(cityIndex, cityList)
        this.setState({
            cityList,
            cityIndex,
        })
    }

    // 渲染每一行
    rowRenderer = ({
        key,
        index,
        isScrolling,
        isVisible,
        style,
    }) => {
        // 获取每一行的字母索引
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]

        //获取指定字母索引下的城市列表数据
        // cityList[letter] 


        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item => <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
                        {item.label}
                    </div>)
                }
            </div>
        );
    }

    // 创建动态计算每一行高度的办法
    getRowHeight = ({ index }) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    // 封装渲染右侧索引列表的方法
    renderCityIndex() {
        // 获取cityIndex ,并遍历
        const { cityIndex, activeIndex } = this.state
        return cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => {
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? 'index-active' : ''}>{item === "hot" ? "热" : item.toUpperCase()}</span>
            </li>


        ))
    }

    // 用于获取List组件中渲染行的信息
    onRowsRendered = ({ startIndex }) => {
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }


    // 切换城市
    changeCity({ label, value }) {
        if (HOUSE_CITY.indexOf(label) > -1) {
            // 有
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.info('该城市暂无房源信息', 1, null, false)

        }
    }
    render() {
        return (
            <div className="cityList">
                <NavHeader>
                    城市选择
                </NavHeader>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            width={width}
                            height={height}
                            ref={this.cityListComponent}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>

                {/* 右侧索引列表 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}