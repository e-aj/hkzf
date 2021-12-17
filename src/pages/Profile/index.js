import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { Grid, Button,Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import { isAuth, getToken,removeToken } from '../../utils/auth'
import { API } from '../../utils/api'
import styles from "./index.module.css"


// 菜单数据
const menus = [
    { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
    { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
    { id: 3, name: '看房记录', iconfont: 'icon-record' },
    {
        id: 4,
        name: '成为房主',
        iconfont: 'icon-identity'
    },
    { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
    { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

const alert = Modal.alert

export default class Profile extends Component {
    state = {
        isLogin: isAuth(),
        userInfo: {
            avatar: '',
            nickname: ''
        }
    }

    componentDidMount() {
        this.getUserInfo()
    }

    // 退出
    logout = () =>{
        alert('提示' ,'是否确认退出?',[
            {tetx:'取消'},
            {tetx: '退出' ,onPress: async () =>{
                // 调用退出接口
                const res = await API.post('/user/logout',null,{
                    headers: {
                        authorization:getToken
                    }
                })
                // 移除本地token
                console.log(res)
                removeToken()

                this.setState({
                    isLogin:false,
                    userInfo: {
                        avatar: '',
                        nickname: ''
                    }

                })

            } }
        ])
    }

    async getUserInfo() {
        if (!this.state.isLogin) {
            // 未登录
            return
        }

        // 发送请求，获取个人资料
        const res = await API.get('/user', {
            headers: {
                authorization: getToken()
            }
        })
        // console.log(res)
        if (res.data.status === 200) {
            const { avatar, nickname } = res.data.body
            this.setState({
                userInfo: {
                    avatar:BASE_URL + avatar,
                    nickname
                }
            })
        }else{
            this.setState({
                isLogin:false
            })
      
        }
    }
    render() {
        const { history } = this.props
        const { isLogin, userInfo: { avatar, nickname } } = this.state

        return (
            <div className={styles.root}>
                {/* 个人信息 */}
                <div className={styles.title}>
                    <img className={styles.bg} src={BASE_URL + '/img/profile/bg.png'} alt="背景图" />

                    <div className={styles.info}>
                        <div className={styles.myIcon}>
                            <img className={styles.avatar} src={avatar || DEFAULT_AVATAR} alt="icon" />
                        </div>
                        <div className={styles.user}>
                            <div className={styles.name}>{nickname || '游客'}</div>
                            {isLogin ?
                                (<div>
                                    <div className={styles.auth}>
                                        <span onClick={this.logout}></span>
                                    </div>
                                    <div className={styles.edit}>
                                        <span className="icondont icon-arrow">
                                            <i className="iconfont icon-arrow" />
                                        </span>
                                    </div>
                                </div>) : (
                                    <div className={styles.edit}>
                                        <Button type="primary" size="small" inline onClick={() => history.push('/login')}>
                                            去登录
                                        </Button>

                                    </div>

                                )}

                        </div>

                    </div>

                </div>

                {/* 九宫格 */}
                <Grid data={menus} columnNum={3} hasLine={true} renderItem={item => (
                    (item.to) ? (
                        <Link to={item.to}>
                            <div className={styles.menuItem}>
                                <i className={`iconfont ${item.iconfont}`} />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className={styles.menuItem}>
                            <i className={`iconfont ${item.iconfont}`} />
                            <span>{item.name}</span>
                        </div>
                    )


                )} />

                {/* 加入我们 */}
                <div className={styles.ad}>
                    <img src={BASE_URL + '/img/profile/join.png'} alt='' />
                </div>

            </div>
        )
    }
}
