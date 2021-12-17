import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import NavHeader from '../../components/NavHeader'

import { API } from '../../utils/api'

import styles from './index.module.css'

// 验证规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
    render() {
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl" />

                {/* 登录表单 */}
                <WingBlank>
                    <Form>
                        {/* 账号 */}
                        <div className={styles.formItem}>
                            <Field className={styles.input} name="username" placeholder="请输入账号"></Field>
                        </div>
                        <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>

                        {/* 密码 */}
                        <div className={styles.formItem}>
                            <Field className={styles.input} name="password" type="password" placeholder="请输入密码"></Field>
                        </div>
                        <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>

                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">
                                登 录
                            </button>
                        </div>
                    </Form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex> 
                </WingBlank>
            </div>
        )
    }
}

Login = withFormik({
    // 提供状态
    mapPropsToValues: () => ({username: '', password: ''}),

    // 添加表单校验规则
    validationSchema: Yup.object().shape({
        username: Yup.string().required('请填写账号').matches(REG_UNAME, '长度为5到8位，只能出现字母、数字、下划线'),
        password: Yup.string().required('请填写密码').matches(REG_PWD, '长度为5到8位，只能出现字母、数字、下划线')
    }),

    // 表单提交事件
    handleSubmit: async (values, { props }) => {
        const { username, password } = values;
        
        const res = await API.post('/user/login', {
            username,
            password
        })

        const { status, body, description } = res.data
        
        if (status === 200) {  // 登录成功
            localStorage.setItem('hkzf_token', body.token)

            // 无法在该方法中，通过 this 来获取路由信息，可以通过第二个对象参数中获取到 props 来使用 props
            if (!props.location.state) {
                props.history.go(-1)  // 返回上一页
            } else {
                props.history.replace(props.location.state.from.pathname)
            }
        } else {
            Toast.info(description, 3, null, false)
        }
    }
})(Login)

// 注意：此处返回的是 高阶组件包装后的组件
export default Login