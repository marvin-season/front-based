export type ResolveType = (value: any) => void
export type RejectType = (value: any) => void
export type ExecutorType = (resolve: ResolveType, reject?: RejectType) => void

const Status = {
    Pending: 0,
    Fulfilled: 1,
    Reject: 2
}

export class PromiseA {
    resolveCallbacks = []
    value = null
    status = Status.Pending  //  pending, fulfilled, or rejected
    constructor(executor?: ExecutorType) {
        this.status = Status.Pending
        const task = []


        const resolve = (value: any) => {
            this.value = value
            this.status = Status.Fulfilled

            this.resolveCallbacks.forEach(fn => fn())
        }
        const reject = () => {

        }

        executor(resolve, reject)
    }

    then(onFulfilled?: any, onRejected?: any) {
        return new PromiseA((resolve, reject) => {
            if (this.status === Status.Fulfilled) {
                const res = onFulfilled(this.value);
                resolve(res)
            } else if (this.status === Status.Reject) {
                onRejected('res')
            } else if (this.status === Status.Pending) {
                this.resolveCallbacks.push(() => {
                    const res = onFulfilled(this.value);
                    resolve(res)
                })
            }
        })
    }

    catch(rejectCallback: any) {

    }

    static resolve(value: any) {
        return new PromiseA((resolve) => resolve(value))
    }

    /**
     *
     * @param promises PromiseA
     */
    static all(promises: PromiseA[]) {
        return new PromiseA(() => {

        })
    }

    static race() {

    }
}

