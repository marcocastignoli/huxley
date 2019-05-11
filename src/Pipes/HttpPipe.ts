import { Message } from '../types'
import Pipe from '../Pipe'

export default class HttpPipe extends Pipe {
    protocol = 'http'
    send(message: Message, callbackResponse?: Function): Boolean {
        //let responseHash = hash(message)
        //(response: Message) => response.sender.address === message.recipient.address && response.hash === responseHash
        return true
    }
    attach(switcher: Function, callback: Function): Boolean {
        return true
    }
    async init() {
        return true
    }
    async close() {
        return true
    }
}