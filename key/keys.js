
// 字母
const _letters = [
    {
        "name": "A",
        "code": 65,
    },
    {
        "name": "B",
        "code": 66,
    },
    {
        "name": "C",
        "code": 67,
    },
    {
        "name": "D",
        "code": 68,
    },
    {
        "name": "E",
        "code": 69,
    },
    {
        "name": "F",
        "code": 70,
    },
    {
        "name": "G",
        "code": 71,
    },
    {
        "name": "H",
        "code": 72,
    },
    {
        "name": "I",
        "code": 73,
    },
    {
        "name": "J",
        "code": 74,
    },
    {
        "name": "K",
        "code": 75,
    },
    {
        "name": "L",
        "code": 76,
    },
    {
        "name": "M",
        "code": 77,
    },
    {
        "name": "N",
        "code": 78,
    },
    {
        "name": "O",
        "code": 79,
    },
    {
        "name": "P",
        "code": 80,
    },
    {
        "name": "Q",
        "code": 81,
    },
    {
        "name": "R",
        "code": 82,
    },
    {
        "name": "S",
        "code": 83,
    },
    {
        "name": "T",
        "code": 84,
    },
    {
        "name": "U",
        "code": 85,
    },
    {
        "name": "V",
        "code": 86,
    },
    {
        "name": "W",
        "code": 87,
    },
    {
        "name": "X",
        "code": 88,
    },
    {
        "name": "Y",
        "code": 89,
    },
    {
        "name": "Z",
        "code": 90,
    }
];

// 数字
const _numbers = [
    {
        "name": "0",
        "code": 48,
    },
    {
        "name": "1",
        "code": 49,
    },
    {
        "name": "2",
        "code": 50,
    },
    {
        "name": "3",
        "code": 51,
    },
    {
        "name": "4",
        "code": 52,
    },
    {
        "name": "5",
        "code": 53,
    },
    {
        "name": "6",
        "code": 54,
    },
    {
        "name": "7",
        "code": 55,
    },
    {
        "name": "8",
        "code": 56,
    },
    {
        "name": "9",
        "code": 57,
    }
];

// 其他
const _other = [
    {
        "name": "BackSpace",
        "code": 8,
    },
    {
        "name": "Tab",
        "code": 9,
    },
    {
        "name": "Enter",
        "code": 13,
    },
    {
        "name": "Esc",
        "code": 27,
    },
    {
        "name": "Space",
        "code": 32,
    },
    {
        "name": "PgUp",
        "code": 33,
    },
    {
        "name": "PgDn",
        "code": 34,
    },
    {
        "name": "End",
        "code": 35,
    },
    {
        "name": "Home",
        "code": 36,
    },
    {
        "name": "Insert",
        "code": 45,
    },
    {
        "name": "+",
        "code": 187,
    },
    {
        "name": "-",
        "code": 189,
    },
    {
        "name": ",",
        "code": 188,
    },
    {
        "name": ".",
        "code": 190,
    },
    {
        "name": "/",
        "code": 191,
    },
    {
        "name": "`",
        "code": 192,
    },
    {
        "name": "{",
        "code": 219,
    },
    {
        "name": "[",
        "code": 219,
    },
    {
        "name": "|",
        "code": 220,
    },
    {
        "name": "}",
        "code": 221,
    },
    {
        "name": "]",
        "code": 221,
        "desc": "]"
    }
]

// F1~F12
const _fOperations = [
    {
        "name": "F1",
        "code": 112,
    },
    {
        "name": "F2",
        "code": 113,
    },
    {
        "name": "F3",
        "code": 114,
    },
    {
        "name": "F4",
        "code": 115,
    },
    {
        "name": "F5",
        "code": 116,
    },
    {
        "name": "F6",
        "code": 117,
    },
    {
        "name": "F7",
        "code": 118,
    },
    {
        "name": "F8",
        "code": 119,
    },
    {
        "name": "F9",
        "code": 120,
    },
    {
        "name": "F10",
        "code": 121,
    },
    {
        "name": "F11",
        "code": 122,
    },
    {
        "name": "F12",
        "code": 123,
    }
];

// 方向键
const _direction = [
    {
        "name": "↑",
        "code": 38,
    },
    {
        "name": "↓",
        "code": 40,
    },
    {
        "name": "←",
        "code": 37,
    },
    {
        "name": "→",
        "code": 39,
    }
];


// 操作 修饰符
const _modifier = [
    {
        "name": "Shift",
        "code": 16,
    },
    {
        "name": "Ctrl",
        "code": 17,
    },
    {
        "name": "Alt",
        "code": 18,
    },
    {
        "name": "Meta",
        "code": 91,
    },
    {
        "name": "⌥",
        "code": 18,
    },
    {
        "name": "⌘",
        "code": 91,
    },
    {
        "name": "⇧",
        "code": 16,
    },
    {
        "name": "⌃",
        "code": 17,
    }
];

const _mods = {
    16: false,
    17: false,
    18: false,
    91: false,
};

const _keyMap = _letters.concat(_numbers).concat(_modifier).concat(_other).concat(_fOperations).concat(_direction);

const _handlers = {};

export {
    _keyMap,
    _handlers,
    _modifier,
    _mods
}
