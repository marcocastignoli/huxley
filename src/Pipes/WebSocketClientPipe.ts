import { Message } from '../types'
import Pipe from '../Pipe'

export default class WebSocketClientPipe extends Pipe {
    protocol = 'ws'
    socket: any
    constructor(socket: any) {
        super()
        this.socket = socket
    }
    send(message: Message, callbackResponse?: Function): Boolean {
        this.socket.emit('asd', message)
        if (callbackResponse) {
            return true
        } else {
            return false
        }
    }
    attach(switcher: Function, callback: Function): Boolean {
        this.socket.on('asd', (message: Message) => {
            if (switcher(message)) {
                callback(message)
            }
        })
        return true
    }
    async init(): Promise<Boolean> {
        return new Promise(resolve => {
            this.socket.on('connect', () => {
                resolve(true)
            })
        })
    }
    async close() {
        return true
    }
}