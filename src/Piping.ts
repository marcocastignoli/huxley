import { Entity, Message, PlugSettings } from './types'
import Pipe from './Pipe'
import Plug from './Plug'
import NullPipe from './Pipes/NullPipe'

export default class Piping {
    pipes: Array<Pipe>;
    constructor(pipes: Array<Pipe>) {
        this.pipes = pipes
    }
    getPipeByEntity(entity: Entity): Pipe {
        return this.pipes.find(pipe => pipe.protocol === entity.protocol) || new NullPipe()
    }
    send(message: Message, callbackResponse?: Function): Boolean {
        let pipe: Pipe = this.getPipeByEntity(message.recipient)
        return pipe.send(message, callbackResponse)
    }
    attach(plugSettings: PlugSettings, callback: Function) {
        const plug = new Plug(this.pipes, plugSettings)
        plug.attach(callback)
    }
    async init(): Promise<Boolean> {
        let success: Boolean = true
        for (let i = 0; i < this.pipes.length; i++) {
            success = await this.pipes[i].init()
            if (!success) {
                break
            }
        }
        return success
    }
    async close(): Promise<Boolean> {
        let success: Boolean = true
        for (let i = 0; i < this.pipes.length; i++) {
            success = await this.pipes[i].close()
            if (!success) {
                break
            }
        }
        return success
    }
}