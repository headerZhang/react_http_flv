import React from 'react'
import Login from "../pages/login/Login";
import One from "../pages/one/One";
import Two from "../pages/two/Two";
import Three from "../pages/three/Three";
import NotFound from "../pages/NotFound";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';


export const mainRoutes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/404',
    component: NotFound
  }
]

export const adminRoutes = [
  {
    path: '/layout/one',
    component: One,
    isShow: true,
    title: <span><UserOutlined />模块一</span>
  },
  {
    path: '/layout/two',
    component: Two,
    isShow: true,
    title: <span><LaptopOutlined />模块二</span>
  },
  {
    path: '/layout/three',
    component: Three,
    isShow: true,
    title: <span><NotificationOutlined />模块三</span>
  },
]
