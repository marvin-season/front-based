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

export const handleScroll: (selector: string, options: ScrollIntoViewOptions) => void
    = (selector, options = {
    behavior: 'smooth',
    block: "end",
}) => {
    const targets = document.querySelectorAll('#text_highlight');
    targets[targets.length - 1]?.scrollIntoView(options)
};

export const sleep = async (timeout: number) => new Promise((resolve) => {
    const timerId = setTimeout(() => {
        resolve(true)
        console.log("🚀 => clear timer ", timerId)
        clearTimeout(timerId);
    }, timeout)
});

/**
 *
 * @param array group target
 * @param key group key
 */
export const groupBy = <T>(array: T[], key: keyof T) => {
    return array.reduce((prev: T[][], cur: T) => {
        const find = prev?.find((item) => item?.find((item_) => item_[key] === cur[key]));
        if (find) {
            find.push(cur);
        } else {
            prev?.push([cur]);
        }
        return prev;
    }, []) as T[][];
};
