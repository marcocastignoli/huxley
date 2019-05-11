import { Message } from '../types'
import Pipe from '../Pipe'
import hash from 'object-hash'
import { Server, Socket } from 'socket.io'

type CallbackSocket = {
    callback: Callback,
    socket: Socket
}

class Callback {
    switcher: Function
    callback: Function
    private _hash: String
    constructor(switcher: Function, callback: Function) {
        this.switcher = switcher
        this.callback = callback
        this._hash = hash({
            switcher: this.switcher,
            callback: this.callback, 
        })
    }
    hash(): String {
        return this._hash
    }
}

export default class WebSocketPipe extends Pipe {
    sockets: Array<Socket> = []
    server: Server
    protocol = 'ws'
    callbacks: Array<Callback> = []
    callbackSocket: Array<CallbackSocket> = []
    constructor(server: Server) {
        super()
        this.server = server
    }
    send(message: Message, callbackResponse?: Function): Boolean {
        //let responseHash = hash(message)
        let socket = this.sockets.find((socket: Socket) => socket.id === message.recipient.address)
        if (!socket) {
            return false
        }
        socket.emit('asd', message)
        if (callbackResponse) {
            return true
        } else {
            return false
        }
    }
    attach(switcher: Function, callback: Function): Boolean {
        // Create new Callback object
        let newCallback = new Callback(switcher, callback)
        this.callbacks.push(newCallback)

        /* this.callbacks.forEach(callback => {
                if (!this.callbackSocket.find((ps: CallbackSocket) => ps.callback.hash() === callback.hash() && ps.socket.id === socket.id )) {
                    
                }
        }) */
        // Attach the new callback to all the sockets
        this.sockets.forEach(socket => {
            socket.on('asd', (message: Message) => {
                if (newCallback.switcher(message)) {
                    newCallback.callback(message)
                }
            })
            this.callbackSocket.push({callback: newCallback, socket})
        })
        return true
    }
    async init() {
        this.server.on("connection", (socket: any) => {
            this.sockets.push(socket)
            this.callbacks.forEach(callback => {
            socket.on('asd', (message: Message) => {
                    if (callback.switcher(message)) {
                        callback.callback(message)
                    }
                })
                this.callbackSocket.push({callback, socket})
            })
        })
        return true
    }
    close(): Promise<Boolean> {
        return new Promise(resolve => {
            this.server.close(() => {
                resolve(true)
            })
        })
    }
}