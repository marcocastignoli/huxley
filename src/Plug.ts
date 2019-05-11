import { PlugSettings } from './types'
import Pipe from 'Pipe'

// With the plug you can attach callbacks to incoming messages
export default class Plug {
    pipes: Array<Pipe>;
    settings: PlugSettings;
    constructor(pipes: Array<Pipe>, settings: PlugSettings) {
        this.pipes = pipes
        this.settings = settings
    }
    attach(callback: Function): Boolean {
        this.pipes.forEach(pipe => {
            if (this.settings && this.settings.switcher) {
                pipe.attach(this.settings.switcher, callback)
            }
        })

        return true
    }
}