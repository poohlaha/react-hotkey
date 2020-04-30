import Util from './utils';
import {_handlers, _keyMap, _modifier, _mods} from "./keys";

const HotKeys = (function (window) {

    function hotKeys(key, option, method) {
        this._downKeys = []; // 记录摁下的绑定键
        this._scope = 'all'; // 默认热键范围
        this.elementHasBindEvent = []; // 已绑定事件的节点记录
        this.splitKey = '+';
        this.code = (x) => {
            let item = Util.getKeyData(_keyMap, x, 'name', false);
            return item.code || x.toUpperCase().charCodeAt(0);
        };
        this.init(key, option, method);
    }

    /**
     * 初始化
     * key -- 数组json格式或string类型用','分割
     * [
     *  {
     *      type: '', // 类型, 用于识别快捷键分类
     *      keys: [], // 快捷键, 用逗号分割
     *  }
     * ]
     */
    hotKeys.prototype.init = function (key, option, method) {
        this._downKeys = [];
        this.analysisKeyString(key, option, method, '');
        this.analysisKeyObject(key, option, method);
    };

    // 解析string类型的key
    hotKeys.prototype.analysisKeyString = function(key, option, method, type) {
        if (typeof key !== 'string') return;

        let keys = Util.getKeys(key); // 需要处理的快捷键列表
        let mods = [];

        let scope = 'all'; // scope默认为all，所有范围都有效
        let element = document; // 快捷键事件绑定节点
        let keyup = false;
        let keydown = true;

        // 对为设定范围的判断
        if (method === undefined && typeof option === 'function') {
            method = option;
        }

        if (Object.prototype.toString.call(option) === '[object Object]') {
            if (option.scope) scope = option.scope; // eslint-disable-line
            if (option.element) element = option.element; // eslint-disable-line
            if (option.keyup) keyup = option.keyup; // eslint-disable-line
            if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line
            if (typeof option.splitKey === 'string') this.splitKey = option.splitKey; // eslint-disable-line
        }

        if (typeof option === 'string') scope = option;

        for (let i = 0; i < keys.length; i++) {
            mods = [];
            let _key = keys[i];
            if (!_key) continue;

            _key = _key.split(this.splitKey); // 按键列表
            if (_key.length === 0) continue;

            // 如果是组合快捷键取得组合快捷键
            if (_key.length > 1) mods = Util.getMods(_modifier, _key);

            // 将非修饰键转化为键码
            _key = _key[_key.length - 1];
            _key = _key === '*' ? '*' : this.code(_key); // *表示匹配所有快捷键

            // 判断key是否在_handlers中，不在就赋一个空数组
            if (!(_key in _handlers)) _handlers[_key] = [];

            let code = Util.getKeyData(_keyMap, _key, 'code', false);
            if (code) code = mods.concat(code);
            _handlers[_key].push({
                keyup,
                keydown,
                type: type,
                scope,
                mods,
                code: code,
                shortcut: keys[i],
                method,
                key: keys[i],
                splitKey: this.splitKey,
            });
        }

        // 在全局document上设置快捷键
        this.setShortKey(element, () => {
            this._downKeys = [];
        });
    };

    // 解析object类型的key
    hotKeys.prototype.analysisKeyObject = function(key, option, method) {
        if (Object.prototype.toString.call(key) !== '[object Array]') return;

        for (let i = 0; i < key.length; i++) {
            let _key = key[i];
            if (!_key) continue;

            let type = _key.type || null; // 类型, 用于区分快捷键
            let keys = _key.keys || [];
            if (!keys || keys.length === 0) continue;

            keys.forEach(item => {
                if (!item) return false; // continue
                this.analysisKeyString(item, option, method, type);
            });
        }
    };

    // 在全局document上设置快捷键
    hotKeys.prototype.setShortKey = function(element, focusCallback) {
        if (typeof element !== 'undefined' && !this.isElementBind(element) && window) {
            this.elementHasBindEvent.push(element);
            Util.addEvent(element, 'keydown', (e) => {
                this.dispatch(e);
            });
            Util.addEvent(window, 'focus', () => {
                focusCallback && focusCallback();
            });
            Util.addEvent(element, 'keyup', (e) => {
                this.dispatch(e);
                this.clearModifier(e);
            });
        }
    }


    // 设置获取当前范围（默认为'所有'）
    hotKeys.prototype.setScope = function(scope) {
        this._scope = scope || 'all';
    };

    // 获取当前范围
    hotKeys.prototype.getScope = function() {
        return this._scope || 'all';
    };

    // 获取摁下绑定键的键值
    hotKeys.prototype.getPressedKeyCodes = function() {
        return this._downKeys.slice(0);
    };

    // 表单控件控件判断 返回 Boolean
    // hotkey is effective only when filter return true
    hotKeys.prototype.filter = function(event) {
        const target = event.target || event.srcElement;
        const {tagName} = target;
        let flag = true;
        // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
        if (
            target.isContentEditable
            || ((tagName === 'INPUT' || tagName === 'TEXTAREA') && !target.readOnly)
        ) {
            flag = false;
        }

        return flag;
    };

    // 判断摁下的键是否为某个键，返回true或者false
    hotKeys.prototype.isPressed = function(keyCode) {
        if (typeof keyCode === 'string') {
            keyCode = this.code(keyCode); // 转换成键码
        }
        return this._downKeys.indexOf(keyCode) !== -1;
    };

    // 循环删除handlers中的所有 scope(范围)
    hotKeys.prototype.deleteScope = function(scope, newScope) {
        let handlers;
        let i;

        // 没有指定scope，获取scope
        if (!scope) scope = this.getScope();

        for (const key in _handlers) {
            if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
                handlers = _handlers[key];
                for (i = 0; i < handlers.length;) {
                    if (handlers[i].scope === scope) handlers.splice(i, 1);
                    else i++;
                }
            }
        }

        // 如果scope被删除，将scope重置为all
        if (this.getScope() === scope) this.setScope(newScope || 'all');
    };

    // 清除修饰键
    hotKeys.prototype.clearModifier = function(event) {
        let key = event.keyCode || event.which || event.charCode;
        const i = this._downKeys.indexOf(key);

        // 从列表中清除按压过的键
        if (i >= 0) {
            this._downKeys.splice(i, 1);
        }
        // 特殊处理 command 键，在 command 组合快捷键 keyup 只执行一次的问题
        if (event.key && event.key.toLowerCase() === 'meta') {
            this._downKeys.splice(0, this._downKeys.length);
        }

        // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除
        if (key === 93 || key === 224) key = 91;
        if (key in _mods) {
            _mods[key] = false;

            // 将修饰键重置为false
            let _item = Util.getKeyData(_modifier, key, "code");
            if (_item && _item.code === key) {
                hotkeys[_item.code] = false;
            }
        }
    };

    // 解除绑定
    hotKeys.prototype.unbind = function(keysInfo, ...args) {
        // unbind(), unbind all keys
        if (!keysInfo) {
            Object.keys(_handlers).forEach((key) => delete _handlers[key]);
        } else if (Array.isArray(keysInfo)) {
            // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
            /* keysInfo.forEach((info) => {
                if (info.key) this.eachUnbind(info);
            }); */

            keysInfo.forEach((info) => {
                if (info.keys && info.keys.length > 0) {
                    info.keys.forEach(key => {
                        if (key) this.eachUnbind({key: key});
                    });
                } else {
                    if (info.key) this.eachUnbind(info);
                }
            });

        } else if (typeof keysInfo === 'object') {
            // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
            if (keysInfo.key) this.eachUnbind(keysInfo);
        } else if (typeof keysInfo === 'string') {
            // support old method
            // eslint-disable-line
            let [scope, method] = args;
            if (typeof scope === 'function') {
                method = scope;
                scope = '';
            }
            this.eachUnbind({
                key: keysInfo,
                scope,
                method
            });
        }
    };

    // 解除绑定某个范围的快捷键
    hotKeys.prototype.eachUnbind = function({key, scope, method}) {

        const multipleKeys = Util.getKeys(key);
        multipleKeys.forEach((originKey) => {
            const unbindKeys = originKey.split(this.splitKey);
            const len = unbindKeys.length;
            const lastKey = unbindKeys[len - 1];
            const keyCode = lastKey === '*' ? '*' : this.code(lastKey);
            if (!_handlers[keyCode]) return;
            // 判断是否传入范围，没有就获取范围
            if (!scope) scope = this.getScope();
            const mods = len > 1 ? Util.getMods(_modifier, unbindKeys) : [];
            _handlers[keyCode] = _handlers[keyCode].map((record) => {
                // 通过函数判断，是否解除绑定，函数相等直接返回
                const isMatchingMethod = method ? record.method === method : true;
                if (
                    isMatchingMethod
                    && record.scope === scope
                    && Util.compareArray(record.mods, mods)
                ) {
                    return {};
                }
                return record;
            });
        });
    };

    // 对监听对应快捷键的回调函数进行处理
    hotKeys.prototype.eventHandler = function(event, handler, scope) {
        let modifiersMatch;

        const contains = (data, key) => {
            if (!data || data.length === 0) return false;
            let arr = data.filter(item => item.code === parseInt(key));
            return arr.length > 0;
        };

        // 看它是否在当前范围
        if (handler.scope === scope || handler.scope === 'all') {
            // 检查是否匹配修饰符（如果有返回true）
            modifiersMatch = handler.mods.length > 0;

            for (const y in _mods) {
                if (Object.prototype.hasOwnProperty.call(_mods, y)) {
                    if (
                        (!_mods[y] && contains(handler.mods, +y))
                        || (_mods[y] && !contains(handler.mods, +y))
                    ) {
                        modifiersMatch = false;
                    }
                }
            }

            // 调用处理程序，如果是修饰键不做处理
            if (
                (handler.mods.length === 0
                    && !_mods[16]
                    && !_mods[18]
                    && !_mods[17]
                    && !_mods[91])
                || modifiersMatch
                || handler.shortcut === '*'
            ) {
                if (handler.method(event, handler) === false) {
                    if (event.preventDefault) event.preventDefault();
                    else event.returnValue = false;
                    if (event.stopPropagation) event.stopPropagation();
                    if (event.cancelBubble) event.cancelBubble = true;
                }
            }
        }
    };

    // 处理keydown事件
    hotKeys.prototype.dispatch = function(event) {
        const asterisk = _handlers['*'];
        let key = event.keyCode || event.which || event.charCode;

        // 表单控件过滤 默认表单控件不触发快捷键
        if (!this.filter.call(this, event)) return;

        // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
        // Webkit左右 command 键值不一样
        if (key === 93 || key === 224) key = 91;

        /**
         * Collect bound keys
         * If an Input Method Editor is processing key input and the event is keydown, return 229.
         * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
         * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
         */
        if (this._downKeys.indexOf(key) === -1 && key !== 229) this._downKeys.push(key);

        /**
         * Jest test cases are required.
         * ===============================
         */
        // ctrl alt shift meta 特殊key
        for(let k in _mods) {
            // get key name by code
            const item = Util.getKeyData(_modifier, k, 'code');
            if (!item) continue;

            let keyName = Util.capitalize(item.name, false) + 'Key';
            let keyCode = item.code;

            if (event[keyName] && this._downKeys.indexOf(keyCode) === -1) {
                this._downKeys.push(keyCode);
            } else if (!event[keyName] && this._downKeys.indexOf(keyCode) > -1) {
                this._downKeys.splice(this._downKeys.indexOf(keyCode), 1);
            }
        }

        /*
        ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach((keyName) => {
            const keyNum = modifierMap[keyName];
            if (event[keyName] && this._downKeys.indexOf(keyNum) === -1) {
                this._downKeys.push(keyNum);
            } else if (!event[keyName] && this._downKeys.indexOf(keyNum) > -1) {
                this._downKeys.splice(this._downKeys.indexOf(keyNum), 1);
            }
        });
        */

        /**
         * -------------------------------
         */
        if (key in _mods) {
            _mods[key] = true;

            // 将特殊字符的key注册到 hotkeys 上
            const item = Util.getKeyData(_modifier, key, 'code');
            if (item) {
                hotkeys[key] = true;
            }

            if (!asterisk) return;
        }

        // 将 modifierMap 里面的修饰键绑定到 event 中
        for (const e in _mods) {
            if (Object.prototype.hasOwnProperty.call(_mods, e)) {
                const item = Util.getKeyData(_modifier, e, 'code');
                if (item) _mods[e] = event[Util.capitalize(item.name, false) + 'Key'];
            }
        }

        /**
         * https://github.com/jaywcjlove/hotkeys/pull/129
         * this solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
         * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
         * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
         */
        if (event.getModifierState && (!(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph'))) {
            if (this._downKeys.indexOf(17) === -1) {
                this._downKeys.push(17);
            }

            if (this._downKeys.indexOf(18) === -1) {
                this._downKeys.push(18);
            }

            _mods[17] = true;
            _mods[18] = true;
        }

        // 获取范围 默认为 `all`
        const scope = this.getScope();
        // 对任何快捷键都需要做的处理
        if (asterisk) {
            for (let i = 0; i < asterisk.length; i++) {
                if (
                    asterisk[i].scope === scope
                    && ((event.type === 'keydown' && asterisk[i].keydown)
                    || (event.type === 'keyup' && asterisk[i].keyup))
                ) {
                    this.eventHandler(event, asterisk[i], scope);
                }
            }
        }

        // key 不在 _handlers 中返回
        if (!(key in _handlers)) return;

        for (let i = 0; i < _handlers[key].length; i++) {
            if (
                (event.type === 'keydown' && _handlers[key][i].keydown)
                || (event.type === 'keyup' && _handlers[key][i].keyup)
            ) {
                if (_handlers[key][i].key) {
                    const record = _handlers[key][i];
                    const {splitKey} = record;
                    const keyShortcut = record.key.split(splitKey);
                    const _downKeysCurrent = []; // 记录当前按键键值
                    for (let a = 0; a < keyShortcut.length; a++) {
                        _downKeysCurrent.push(this.code(keyShortcut[a]));
                    }
                    if (_downKeysCurrent.sort().join('') === this._downKeys.sort().join('')) {
                        // 找到处理内容
                        this.eventHandler(event, record, scope);
                    }
                }
            }
        }
    };

    // 判断 element 是否已经绑定事件
    hotKeys.prototype.isElementBind= function(element) {
        return this.elementHasBindEvent.indexOf(element) > -1;
    };

    return hotKeys;

})(window);

if (typeof window !== 'undefined') {
    const _hotkeys = window.hotkeys;
    /*hotkeys.noConflict = (deep) => {
        if (deep && window.hotkeys === hotkeys) {
            window.hotkeys = _hotkeys;
        }
        return hotkeys;
    }; */
    window.hotkeys = new HotKeys();
}

export default hotkeys;
