export const debounce = (fn: Function, delay = 1000) => {
    let timer = null;

    return (...args: any) => {
        console.log('args', args)
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(this, ...args)
            timer = null
        }, delay)
    }
}


export const throttle = (fn: Function, delay = 1000) => {
    let timer = null
    return (...args: any) => {
        if (timer) {
            return
        }

        timer = setTimeout(() => {
            fn.call(this, ...args)
            timer = null
        }, delay)
    }

}


export const call_ = function (ctx = {}, ...args: any) {

    const key = Symbol()
    ctx[key] = this;
    const res = ctx[key](...args)
    delete ctx[key]
    return res
}

export const handleScroll = (selector: string) => {
    let targetEle = document.querySelector(selector);
    // const targetEle = all[0] || all[1];
    console.log('targetEle', targetEle);
    targetEle?.scrollIntoView({behavior: 'smooth'});
};

export const sleep = async (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

/**
 *
 * @param array group target
 * @param key group key
 */
export const groupBy = (array: ChatItem[], key: keyof ChatItem) => {
    return array.reduce((prev: ChatItem[][], cur: ChatItem) => {
        const find = prev?.find((item) => item?.find((item_) => item_[key] === cur[key]));
        if (find) {
            find.push(cur);
        } else {
            prev?.push([cur]);
        }
        return prev;
    }, []);
};
