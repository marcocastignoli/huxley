import { Message } from './types'
export default abstract class Pipe {
    working: Boolean = true
    protocol: String | null = null
    abstract send(message: Message, callbackResponse?: Function): Boolean
    abstract attach(switcher: Function, callback: Function): Boolean
    abstract async init(): Promise<Boolean>
    abstract async close(): Promise<Boolean>
}