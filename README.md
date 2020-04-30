# react-hotkey
react hot key 参照 https://github.com/jaywcjlove/hotkeys/ 进行修改,添加支持数组格式.

## 文档
1. string类型的文档, 请参照 https://github.com/jaywcjlove/react-hotkeys,
2. 数组类型的设置keyName使用如下:
```
[
  {
      type: 'component',
      keys: ['T', 'L', 'Alt+s', '1']
  },
  {
      type: 'operation',
      keys: ['ctrl+M', 'p', 'Alt+↑', '↓']
  }
]

ps: type是用于区分快捷键分类.
```
 返回结果如下:
```
 {
    "keyup":false,
    "keydown":true,
    "type":"operation",
    "scope":"all",
    "mods":[
        {
            "name":"Alt",
            "code":18
        }
    ],
    "code":[
        {
            "name":"Alt",
            "code":18
        },
        {
            "name":"↑",
            "code":38
        }
    ],
    "shortcut":"Alt+↑",
    "key":"Alt+↑",
    "splitKey":"+"
}
 ```
 
 ## Demo
 ```
import React from 'react';
import Hotkeys from 'react-hot-key';

export default class ReactHotkeyDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'ready to listening keydown and keyup',
    }
  }
  
  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle)
    this.setState({
      text: `onKeyUp ${keyName}`,
    });
  }
  
  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle)
    this.setState({
      text: `onKeyDown ${keyName}`,
    });
  }
  
  render() {
    /* return (
      <Hotkeys 
        keyName="shift+a,alt+s" 
        onKeyDown={this.onKeyDown.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
      >
        <div style={{ padding: "100px" }}>
          {this.state.text}
        </div>
      </Hotkeys>
    ) */
    
     return (
      <Hotkeys 
         keyName={[
            {
                type: 'component',
                keys: ['T', 'L', 'Alt+s', '1']
            },
            {
                type: 'operation',
                keys: ['ctrl+M', 'p', 'Alt+↑', '↓']
            }
        ]}
        onKeyDown={this.onKeyDown.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
      >
        <div style={{ padding: "100px" }}>
          {this.state.text}
        </div>
      </Hotkeys>
    )
    
  }
}

 ```

