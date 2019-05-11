import { Message } from '../types'
import Pipe from '../Pipe'

export default class NullPipe extends Pipe {
    working = false
    protocol = null
    send(message: Message, callbackResponse?: Function): Boolean {
        if (message && callbackResponse) {
            return true
        }
        return false
    }
    attach(switcher: Function, callback: Function): Boolean {
        if (switcher && callback) {
            return true
        }
        return false
    }
    async init() {
        return true
    }
    async close() {
        return true
    }
}