import React from 'react';
import * as PropTypes from 'prop-types';
import Hotkeys, {HotkeysEvent} from './key';

export type OnKeyFun = (shortcut: string, evn: KeyboardEvent, handle: HotkeysEvent) => void;

export interface IReactHotkeysProps {
    keyName?: string | Array<any>;
    filter?: (event: KeyboardEvent) => boolean;
    onKeyUp?: OnKeyFun;
    onKeyDown?: OnKeyFun;
    allowRepeat?: boolean;
    disabled?: boolean;
    splitKey?: string;
}

export default class ReactHotkeys extends React.Component<IReactHotkeysProps> {

    private isKeyDown: boolean = false;
    private handle: HotkeysEvent;

    public static defaultProps: IReactHotkeysProps = {
        filter(event: KeyboardEvent) {
            const target = (event.target as HTMLElement) || event.srcElement;
            var tagName = target.tagName;
            return !(target.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
        },
    };

    static propTypes = {
        keyName: PropTypes.string || PropTypes.array,
        filter: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyUp: PropTypes.func,
        disabled: PropTypes.bool,
        splitKey: PropTypes.string
    };

    constructor(props: IReactHotkeysProps) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyUpEvent = this.handleKeyUpEvent.bind(this);
        this.handle = {} as HotkeysEvent;
    }

    componentDidMount() {
        const {filter, splitKey} = this.props;
        if (filter) {
            Hotkeys.filter = filter;
        }
        Hotkeys.unbind(this.props.keyName);
        Hotkeys.init(this.props.keyName, {splitKey}, this.onKeyDown);
        document && document.body.addEventListener('keyup', this.handleKeyUpEvent);
    }

    componentWillUnmount() {
        Hotkeys.unbind(this.props.keyName);
        this.isKeyDown = true;
        this.handle = {} as HotkeysEvent;
        document && document.body.removeEventListener('keyup', this.handleKeyUpEvent);
    }

    onKeyUp(e: KeyboardEvent, handle: HotkeysEvent) {
        const {onKeyUp, disabled} = this.props;
        !disabled && onKeyUp && onKeyUp(handle.shortcut, e, handle)
    }

    onKeyDown(e: KeyboardEvent, handle: HotkeysEvent) {
        const {onKeyDown, allowRepeat, disabled} = this.props;
        if (this.isKeyDown && !allowRepeat) return;
        this.isKeyDown = true;
        this.handle = handle;
        !disabled && onKeyDown && onKeyDown(handle.shortcut, e, handle)
    }

    handleKeyUpEvent(e: KeyboardEvent) {
        if (!this.isKeyDown) return;
        this.isKeyDown = false;
        if (this.props.keyName && typeof this.props.keyName === 'string') { // string
            if (this.props.keyName && this.props.keyName.indexOf(this.handle.shortcut) < 0) return;
        } else if (this.props.keyName && Object.prototype.toString.call(this.props.keyName) === '[object Array]') { // array
            let flag = true;
            let arr: any = this.props.keyName || [];
            arr.forEach((item: any) => {
                let keys = item.keys || [];
                if (keys && keys.length > 0) {
                    keys.forEach((key: string) => {
                        if (key.indexOf(this.handle.shortcut) !== -1) {
                            flag = false;
                            return false;
                        }
                    });
                }
            });

            if (flag) return;
        }

        this.onKeyUp(e, this.handle);
        this.handle = {} as HotkeysEvent;
    }

    render() {
        return this.props.children || null;
    }
}
