import React from 'react'
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setToken } from "../../common/auth";
import './index.scss'

function Login(props) {
  const onFinish = values => {
    console.log('Received values of form: ', values);
    let login = {
      username: values.username,
      password: values.password,
    }
    message.info('登录成功!')
    setToken(JSON.stringify(login))
    props.history.push('/layout')
    // window.$api.UserLogin(values)
    //   .then((res) => {
    //     let login = {
    //       username: values.username,
    //       password: values.password,
    //       permission: res.data.permission,
    //       authToken: res.headers["auth-token"],
    //     }
    //     message.info('登录成功!')
    //     setToken(JSON.stringify(login))
    //     props.history.push('/layout')
    //   })
    //   .catch((err) => {
    //     message.error(err)
    //   })
  };

  return (
    <Card title="登  录" className="login-form">
      <Form
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>

      </Form>
    </Card>
  )
}

export default Login
