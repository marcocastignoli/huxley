
import Piping from '../src/Piping'
import WebSocketPipe from '../src/Pipes/WebSocketPipe'
import WebSocketClientPipe from '../src/Pipes/WebSocketClientPipe'
import {Message, Entities, Entity} from '../src/types'
import socketIO = require('socket.io');
import socketIOClient = require('socket.io-client')
/*
import { Message, Entity, Entities } from '../src/types'
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
}, (message: Message) => message) */


describe('Can send and receive messages', () => {
  let io = socketIO()
  const server = io.listen(3000);
  const serverPiping = new Piping([
    new WebSocketPipe(server)
  ])

  const socket = socketIOClient('http://localhost:3000')
  const clientPiping = new Piping([
    new WebSocketClientPipe(socket)
  ])
  beforeAll(done => {
    serverPiping
      .init()
      .then(success => {
        if (success) {
          clientPiping
            .init()
            .then(success => {
              if (success) {
                done()
              }
            })
        }
      })

  })
  afterAll(done => {
    serverPiping
      .close()
      .then(success => {
        if (success) {
          done()
        }
      })
  })
  it('Server can send messages and client receive', done => {
    clientPiping.attach({
      switcher: (message: Message) => message.action === 'test',
    }, (message: Message) => {
      expect(message.parameters).toStrictEqual({success: true})
      done()
    })

    let clientPipingPipe = <WebSocketClientPipe>clientPiping.pipes.find(pipe => pipe.protocol === 'ws')
    const message = <Message>{
      sender: <Entity>{ address: 'ws-server', protocol: 'ws', type: Entities.Node },
      recipient: <Entity>{ address: clientPipingPipe.socket.id, protocol: 'ws', type: Entities.Client },
      action: 'test',
      parameters: { success: true }
    }
    serverPiping.send(message)
  })
  it('Client can send messages and server receive', done => {
    serverPiping.attach({
      switcher: (message: Message) => message.action === 'test',
    }, (message: Message) => {
      expect(message.parameters).toStrictEqual({success: true})
      done()
    })

    let clientPipingPipe = <WebSocketClientPipe>clientPiping.pipes.find(pipe => pipe.protocol === 'ws')
    const message = <Message>{
      sender: <Entity>{ address: clientPipingPipe.socket.id, protocol: 'ws', type: Entities.Node },
      recipient: <Entity>{ address: 'server', protocol: 'ws', type: Entities.Client },
      action: 'test',
      parameters: { success: true }
    }
    clientPiping.send(message)
  })
})
