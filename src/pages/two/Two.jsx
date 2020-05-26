import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Row, Col, Tooltip, InputNumber, DatePicker } from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';
import flvjs from '../../common/flv.js';
import '../one/index.scss'

function Two() {
  const [scale, setScale] = useState(1)     // 倍速
  const [addr, setAddr] = useState('10.0.22.54:8000')     // ip端口
  const [devid, setDevid] = useState('9898')     // 设备id
  const [recordDate, setRecordDate] = useState('2020-05-20')     // 查询录像时间
  const [player, setPlayer] = useState(null)      // 播放器实例
  const [time, setTime] = useState('00:00:00')      // 时间轴显示时间
  const [recordList, setRecordList] = useState([])     // 录像列表
  const [timeStamp, setTimeStamp] = useState('')     // 发送请求的时间戳
  
  const videoElementRef = useRef(null);
  const rulerRef = useRef(null)

  useEffect(() => {
    // 监听浏览器页面隐藏显示
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        // 切出去了  ,不用管
      } else {
        // 切回来了,把video当前播放时间改为当前缓存最后一包的时间
        let videoEle = videoElementRef.current;
        if (player) {
          videoEle.currentTime = videoEle.buffered.end(0) - 0.5
        }
      }
    });
  }, [])

  // 暂停
  function flvPause() {
    if (player) {
      player.pause();
    } else {
      message.warning('请重新加载!')
    }
  }

  // 停止(卸载视频)
  function flvDestroy() {
    if (player) {
      player.pause();
      player.unload();
      player.detachMediaElement();
      player.destroy();
      setPlayer(null)
    }
  }

  // 鼠标移动
  function handleMouseMove(e) {
    e.persist()
    let rulerEleWidth = rulerRef.current.offsetWidth   //时间轴总宽度
    let distanceWidth = e.pageX - 240  //鼠标到时间轴左侧距离
    let percent = distanceWidth / rulerEleWidth
    let all_second = parseInt(percent * 86400)
    let hour, minute, second
    hour = parseInt(all_second / 3600)
    hour = hour >= 10 ? hour : '0' + hour
    minute = parseInt((all_second - hour * 3600) / 60)
    minute = minute >= 10 ? minute : '0' + minute
    second = all_second - hour * 3600 - minute * 60
    second = second >= 10 ? second : '0' + second

    setTime(hour + ":" + minute + ":" + second)
  }

  // 点击跳转录像
  function handleClick() {
    let timeArray = time.split(":")
    let date_temp = recordDate.replace(/-/, "").replace(/-/, "")
    let playtime = date_temp + timeArray[0] + timeArray[1] + timeArray[2]
    let currentTime = (new Date()).getTime()    // 当前时间戳
    setTimeStamp(currentTime)  // 保存时间戳,倍速使用

    if (player != null) {
      player.pause();
      player.unload();
      player.detachMediaElement();
      player.destroy();
      setPlayer(null)
    }

    if (flvjs.isSupported()) {
      let player_temp = flvjs.createPlayer({
        type: 'flv', // 视频格式
        isLive: true,
        hasVideo: true,
        hasAudio: false,
        cors: true,
        // enableWorker: false,
        // autoCleanupSourceBuffer: true,
        // lazyLoadMaxDuration: 3 * 60,
        seekType: 'range',
        url: `http://${addr}/playback?devid=${devid}&playtime=${playtime}&sid=${currentTime}`, // 视频流地址
      });
      setPlayer(player_temp)
      console.log("flvPlayer: ", player)
      player_temp.attachMediaElement(videoElementRef.current);
      player_temp.load(); //加载
    }

  }
  // 生成录像列表span
  function progressEle() {
    // 此值用来保存下面循环中上一次的endDistance,用来计算marginLeftPx
    let count = ''
    return (
      recordList.map((item, index) => {
        let marginLeftPx
        let startDistance = item.startTime / 86400 * rulerRef.current.offsetWidth    // 开始到时间轴左边的距离
        let endDistance = item.endTime / 86400 * rulerRef.current.offsetWidth    // 结束到时间轴左边的距离

        if (index == 0) {
          marginLeftPx = startDistance + 'px'
        } else {
          marginLeftPx = (startDistance - count) + 'px'
        }

        let width = endDistance - startDistance
        count = endDistance

        return <span key={index} style={{ display: 'block', width: width, height: '45px', float: 'left', background: 'skyblue', marginLeft: marginLeftPx }}>&nbsp;</span>
      })
    )
  }

  // 倍速改变
  function handleRateInputChange(value) {
    setScale(value)
    let videoEle = videoElementRef.current
    // 倍速
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${addr}/command?devid=${devid}&cmd=setvideorate&scale=${value}&sid=${timeStamp}`, true);
    xhr.onload = function (e) {
      let data = JSON.parse(xhr.response).returnState;
      if (data.stateCode == 0) {
        videoEle.playbackRate = value
        message.success(`修改倍速成功,当前倍速:${value}`)
      } else {
        message.warning('倍速消息发送失败!')
      }
    }
    xhr.send(null);
  }

  function handleChangeDate(date, dateString) {
    // dateString: 2020-05-20
    setRecordDate(dateString)
  }

  // 查询录像列表
  function handleQueryRecord() {
    let date_temp = recordDate.replace(/-/, "").replace(/-/, "")
    // 获取录像列表
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${addr}/command?devid=${devid}&cmd=getrecordlist&playtime=${date_temp}`, true);
    xhr.onload = function (e) {
      let data = JSON.parse(xhr.response);
      if (data.returnState) {
        message.warning('获取录像列表失败')
      } else {
        setRecordList(data.recordList)
      }
    }
    xhr.send(null);
  }

  return (
    <div className="one">
      IP端口: &nbsp;&nbsp;
      <Input style={{ width: '300px' }} value={addr} placeholder="请输入ip端口==>10.0.22.54:8000" onChange={(e) => setAddr(e.target.value)} />&nbsp;&nbsp;
      设备ID: &nbsp;&nbsp;
      <Input style={{ width: '120px' }} value={devid} placeholder="请输入设备id"  onChange={(e) => setDevid(e.target.value)}/>&nbsp;&nbsp;
      录像日期: &nbsp;&nbsp;
      <DatePicker value={moment(recordDate, 'YYYY-MM-DD')} placeholder="请选择录像日期" onChange={handleChangeDate} />&nbsp;&nbsp;
      <Button type="primary" onClick={() => handleQueryRecord()}>查询录像</Button>&nbsp;&nbsp;
      <br />
      <video ref={videoElementRef} className="centeredVideo" controls autoPlay>
        别看了,你的辣鸡浏览器不支持!麻溜的换!
      </video>
      <br />
      <div className="controls">
        <Button type="primary" onClick={() => flvPause()}>暂停</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={() => flvDestroy()}>停止</Button>&nbsp;&nbsp;
        倍速 :&nbsp;&nbsp;<InputNumber min={1} max={4} step={1} value={scale} onChange={(value) => handleRateInputChange(value)} />&nbsp;&nbsp;
        <b>(请点击蓝色区域跳转录像)</b>
      </div>
      <Tooltip title={time}>
        <div ref={rulerRef} className="ruler"
          // onMouseOver={(e) => handleMouseOver(e)}
          onMouseMove={(e) => handleMouseMove(e)}
          onClick={() => handleClick()}
        >
          <Row gutter={[8, 8]}>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(item => {
                return (
                  <Col span={1} key={item} style={{ width: '100%', height: '25px', borderLeft: '1px solid black', borderTop: '1px solid black' }}>
                    {item}
                  </Col>
                )
              })
            }
          </Row>
          <div className="progress">
            {
              progressEle()
            }
          </div>
        </div>
      </Tooltip>

    </div>
  )
}

export default Two
