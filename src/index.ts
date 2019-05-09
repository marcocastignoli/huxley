// List all the entities types
export enum Entities {
  Node = 'node',
  Client = 'client'
}

// Define the entity's properties
export type Entity = {
  address: String,
  protocol: String,
  type: Entities
}

// Define the message's properties
export type Message = {
  sender: Entity,
  recipient: Entity,
  action: String,
  parameters: Object,
  hash?: String,
  authentication?: Object
}

// Define the Plug settings
export type PlugSettings = {
  switcher: Function
}

// With the plug you can attach callbacks to incoming messages
export class Plug {
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

export abstract class Pipe {
  working: Boolean = true
  protocol: String | null = null
  abstract send(message: Message, callbackResponse?: Function): Boolean
  abstract attach(switcher: Function, callback: Function): Boolean
}

export class NullPipe extends Pipe {
  working = false
  protocol = null
  send(message: Message, callbackResponse?: Function): Boolean {
    return true
  }
  attach(switcher: Function, callback: Function): Boolean {
    return true
  }
}

export class WebSocketPipe extends Pipe {
  protocol = 'ws'
  send(message: Message, callbackResponse?: Function): Boolean {
    //let responseHash = hash(message)
    return true
  }
  attach(switcher: Function, callback: Function): Boolean {
    return true
  }
}

export class HttpPipe extends Pipe {
  protocol = 'http'
  send(message: Message, callbackResponse?: Function): Boolean {
    //let responseHash = hash(message)
    //(response: Message) => response.sender.address === message.recipient.address && response.hash === responseHash
    return true
  }
  attach(switcher: Function, callback: Function): Boolean {
    return true
  }
}

export class Piping {
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
}

// init
const piping = new Piping([
  new WebSocketPipe(),
  new HttpPipe(),
])

// Send a message
const message = <Message>{
  sender: <Entity>{ address: '123ih123', protocol: 'ws', type: Entities.Node },
  recipient: <Entity>{ address: 'adj1923h', protocol: 'ws', type: Entities.Client },
  action: 'register',
  parameters: {}
}
piping.send(message, (response: Message) => response)

// Listen to messages attaching a callback
piping.attach({
  switcher: (message: Message) => message.action === 'register' && message.sender.type === Entities.Node,
}, (message: Message) => message)