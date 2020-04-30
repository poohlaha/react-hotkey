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

