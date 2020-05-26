import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message } from "antd";
import flvjs from '../../common/flv.js';
import './index.scss'

function One() {
  const [inputInfo, setInputInfo] = useState('http://10.0.22.54:8000/live?devid=9898&channel=0')
  const [seekPoint, setSeekPoint] = useState('')
  const [player, setPlayer] = useState(null)
  const videoElementRef = useRef(null);

  useEffect(() => {
    // flvLoad()
  }, [])

  useEffect(() => {
    // 监听浏览器页面隐藏显示
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        // 切出去了  ,不用管
        console.info('出去了')
      } else {
        // 切回来了,把video当前播放时间改为当前缓存最后一包的时间        
        let videoEle = videoElementRef.current;
        if (player) {
          videoEle.currentTime = videoEle.buffered.end(0) - 0.5
        }    
      }
    });
  }, [])

  // 加载
  function flvLoad() {
    if (player != null) {
      player.pause();
      player.unload();
      player.detachMediaElement();
      player.destroy();
      setPlayer(null)
    }

    console.log('isSupported: ' + flvjs.isSupported());
    if (flvjs.isSupported()) {

      let player_temp = flvjs.createPlayer({
        type: 'flv', // 视频格式
        isLive: true,  //是否是实时流
        hasVideo: true,  // 有无视频轨道
        hasAudio: false,  // 有无音频轨道
        cors: true,
        // enableWorker: false,
        // autoCleanupSourceBuffer: true,
        // lazyLoadMaxDuration: 3 * 60,
        // seekType: 'range',
        url: inputInfo, // 视频流地址
      });

      setPlayer(player_temp)

      console.log("flvPlayer: ", player)
      player_temp.attachMediaElement(videoElementRef.current);
      player_temp.load(); //加载

    }
  }
  // 开始
  function flvStart() {
    if (player) {
      player.play();
    } else {
      message.warning('请重新加载!')
    }
  }
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

  // 修改seek跳转的值
  function handleSeekChange(e) {
    setSeekPoint(e.target.value)
  };

  // 跳转至
  function flvSeekTo() {
    if (player) {
      player.currentTime = parseFloat(seekPoint);
    } else {
      message.warning('请重新加载!')
    }
  }

  // 修改url输入框的值
  function handleUrlInputChange(e) {
    setInputInfo(e.target.value)
  }

  return (
    <div className="one">
      <Input className="urlInput" style={{ width: '500px' }} placeholder="请输入地址" value={inputInfo} onChange={(e) => handleUrlInputChange(e)} />
      <br />
      <video ref={videoElementRef} className="centeredVideo" controls autoPlay>
        别看了,你的辣鸡浏览器不支持!麻溜的换!
      </video>
      <br />
      <div className="controls">
        <Button type="primary" onClick={() => flvLoad()}>加载</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={() => flvStart()}>开始</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={() => flvPause()}>暂停</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={() => flvDestroy()}>停止</Button>&nbsp;&nbsp;
        <Input style={{ width: '100px' }} value={seekPoint} onChange={e => handleSeekChange(e)} />&nbsp;&nbsp;
        <Button type="primary" onClick={() => flvSeekTo()}>跳转</Button>&nbsp;&nbsp;
      </div>

    </div>
  )
}

export default One