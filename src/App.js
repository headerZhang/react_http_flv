import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { adminRoutes } from "./router/index";
import Frame from './components/Frame/Index';
import { isLogined } from "./common/auth";
import './App.css'

function App() {
  return isLogined() ?
    (
      <Frame>
        <Switch>
          {
            adminRoutes.map(route => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  render={routeProps => {
                    return <route.component {...routeProps} />
                  }}
                />
              )
            })
          }
          <Redirect to={adminRoutes[0].path} from="/layout" />
          <Redirect to="/404" />
        </Switch>
      </Frame>
    ) : 
    (
      <Redirect to="/login" />
    )
}

export default App
