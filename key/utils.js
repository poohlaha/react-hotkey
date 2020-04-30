let Utils = {

    // 判断是否是firefox
    isff: typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false,

    // 绑定事件
    addEvent: (object, event, method) => {
        if (object.addEventListener) {
            object.addEventListener(event, method, false);
        } else if (object.attachEvent) {
            object.attachEvent(`on${event}`, () => {
                method(window.event);
            });
        }
    },

    // 修饰键转换成对应的键码
    getMods: (modifier, key) => {
        const mods = key.slice(0, key.length - 1);
        for (let i = 0; i < mods.length; i++) {
           // mods[i] = modifier[mods[i].toLowerCase()];
            mods[i] = Utils.getKeyData(modifier, mods[i]);
        }
        return mods;
    },

    getKeyData: (data, key, name = 'name', needSpecial = true) => {
        if (!data || data.length === 0 || !key) return null;

        let specialKeys = ['ctrl', 'alt', 'shift', 'meta'];
        let _item = null;
        data.map(item => {
            if (needSpecial && specialKeys.indexOf(item.name.toLowerCase()) === -1) return false;
            if (name === 'name') {
                if (item[name].toLowerCase() === key.toLowerCase()) {
                    _item = item;
                    return false;
                }
            } else {
                if (item[name] === parseInt(key)) {
                    _item = item;
                    return false;
                }
            }
        });

        return _item;
    },

    /**
     * 首字母转大写或小写
     */
    capitalize: (word, isUpperCase = true) => {
        if (!word) return '';
        let x = word.substring(0, 1);
        let y = word.substring(1, word.length);
        x = isUpperCase ? x.toUpperCase() : x.toLowerCase();
        return x + y;
    },

        // 处理传的key字符串转换成数组
    getKeys: (key) => {
        if (!key) key = '';
        if (typeof key !== 'string') key = '';
        key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等
        const keys = key.split(','); // 同时设置多个快捷键，以','分割
        let index = keys.lastIndexOf('');

        // 快捷键可能包含','，需特殊处理
        for (; index >= 0;) {
            keys[index - 1] += ',';
            keys.splice(index, 1);
            index = keys.lastIndexOf('');
        }

        return keys;
    },

    // 比较修饰键的数组
    compareArray: (a1, a2) => {
        const arr1 = a1.length >= a2.length ? a1 : a2;
        const arr2 = a1.length >= a2.length ? a2 : a1;
        let isIndex = true;

        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
        }
        return isIndex;
    }

};

export default Utils;
