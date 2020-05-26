import React, { useEffect, useState, Fragment } from 'react'
import { Form, Radio, Row, Col } from 'antd';
import './index.scss'


function Three() {
  const [count, setCount] = useState(0)  //当前分屏数
  const splitScreenArray = [ // 分屏数据
    {
      id: 0,
      name: 4,
      array: numberToArray(4),
      span: 12,
    },
    {
      id: 1,
      name: 8,
      array: numberToArray(8),
      span: 6,
    },
    {
      id: 2,
      name: 9,
      array: numberToArray(9),
      span: 8,
    },
    // {
    //   id: 3,
    //   name: 12,
    //   array: numberToArray(12),
    //   span: 6,
    // },
    // {
    //   id: 4,
    //   name: 16,
    //   array: numberToArray(16),
    //   span: 6,
    // },
  ]

  function handleChangeSplitScreen(e) {
    setCount(e.target.value)
  }
  function handleClickSplitScreenItem(event) {
    event.persist()
    console.log(event)
  }
  //数字转为数组 : 4 ===> [0,1,2,3]
  function numberToArray(number) {
    let arr = []
    for (let index = 0; index < number; index++) {
      arr.push(index)
    }
    return arr
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <header style={{ width: '100%', height: '35px' }}>
        <strong>分屏 : &nbsp;</strong>
        <Radio.Group defaultValue={count} buttonStyle="solid" onChange={handleChangeSplitScreen}>
          {
            splitScreenArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>&nbsp;&nbsp;
                </Fragment>
              )
            })
          }
        </Radio.Group>
      </header>
      <div style={{ width: '100%', height: 'calc(100% - 35px)' }}>
        <div className="four_split_screen">
          <Row>
            {
              splitScreenArray.map((item) => {
                return (
                  item.id == count ?
                    item.array.map((i) => {
                      return <Col key={i} span={item.span} onClick={handleClickSplitScreenItem}>{'分屏' + (i + 1)}</Col>
                    }) : ''
                )
              })
            }
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Three
