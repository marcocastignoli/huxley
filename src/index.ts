export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

enum Entities {
  Node = 'node',
  Client = 'client'
}

export type Entity = {
  address: String,
  protocol: String,
  type: Entities
}

export type Message = {
  sender: Entity,
  recipient: Entity,
  action: String,
  parameters: Object,
  hash?: String,
  authentication?: Object
}

export type PlugSettings = {
  switcher: Function,
  pipe?: Pipe
}

export class Plug {
  piping?: Piping;
  settings?: PlugSettings;
  constructor(piping?: Piping, settings?: PlugSettings) {
    if (piping) {
      this.piping = piping
      if(settings) {
        this.settings = settings
      }
    }
  }
  working() {
    return this.piping ? true : false
  }
  attach(callback: Function): Boolean {

    let pipes = []
    if (this.settings && this.settings.pipe) {
      pipes.push(this.settings.pipe)
    } else if (this.piping) {
      pipes = this.piping.pipes
    } else {
      return false
    }

    pipes.forEach(pipe => {
      if (this.settings && this.settings.switcher) {
        pipe.attach(this.settings.switcher, callback)
      }
    })

    return true
  }
}

class Pipe {
  id?: String
  constructor(id?: String) {
    if (id) {
      this.id = id
    }
  }
  working() {
    return this.id ? true : false
  }
  send(message: Message): Promise<any> {
    return new Promise(resolve=>resolve())
  }
}

class Piping {
  pipes: Array<Pipe>;
  constructor(pipes: Array<Pipe>) {
    this.pipes = pipes
  }
  getPipeByEntity(entity: Entity): Pipe {
    return this.pipes.find(pipe => pipe.id === entity.protocol) || new Pipe()
  }
  send(message: Message, callbackResponse?: Function): Promise<any> {
    let pipe: Pipe = this.getPipeByEntity(message.recipient)
    if (!pipe.working()) {
      return new Promise((_resolve, reject)=> reject())
    }
    if (callbackResponse) {
      let responseHash = hash(message)
      let plug = new Plug(this, {
        pipe: pipe,
        switcher: (response: Message) => response.sender.address === message.recipient.address && response.hash === responseHash
      })  
      plug.attach(callbackResponse)
    }
    return pipe.send(message)
  }
}

// init
const wsPipe = new Pipe('ws')
const httpPipe = new Pipe('http')
const piping = new Piping([wsPipe, httpPipe])

// Send a message
const message = <Message>{
  sender: <Entity>{ address: '123ih123', protocol: 'ws', type: Entities.Node },
  recipient: <Entity>{ address: 'adj1923h', protocol: 'ws', type: Entities.Client },
  action: 'register',
  parameters: {}
}
piping.send(message, (message: Message) => message)


// Listen to messages attaching a callback
const plug = new Plug(piping, {
  switcher: (message: Message) => message.action === 'register' && message.sender.type === Entities.Node,
})
if (plug.working()){
  plug.attach((message: Message) => message)
}