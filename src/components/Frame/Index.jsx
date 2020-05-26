import React from 'react'
import { withRouter } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import logo from './logo.png'
import './index.scss'
import { adminRoutes } from '../../router/index'
import { getToken, clearToken } from "../../common/auth";
const { Header, Content, Sider } = Layout;

const routes = adminRoutes.filter(route => route.isShow)

function Index(props) {
  const path = props.location.pathname
  const menu = (
    <Menu onClick={(item) => {
      if (item.key === "logout") {
        clearToken()
        props.history.push('/login')
      } else {
        message.info(item.key)
      }
    }}>
      <Menu.Item key="noti">通知中心</Menu.Item>
      <Menu.Item key="setting">设置</Menu.Item>
      <Menu.Item key="logout">退出</Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header className="header">
        <div className="logo" >
          <img src={logo} alt="logo" />
        </div>
        <Dropdown overlay={menu} >
          <div>
            <Avatar style={{ backgroundColor: '#87d068' }}>USER</Avatar>
            <span style={{ color: '#fff' }}>{getToken().username}</span>
            <DownOutlined style={{ color: '#fff' }} />
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={[path]}
            style={{ height: '100%', borderRight: 0 }}
          >
            {
              routes.map((route) => {
                return <Menu.Item key={route.path} onClick={p => props.history.push(p.key)}>{route.title}</Menu.Item>
              })
            }
          </Menu>
        </Sider>
        <Layout style={{ padding: '16px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Scrollbars autoHide>
              {props.children}
            </Scrollbars>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default withRouter(Index)
