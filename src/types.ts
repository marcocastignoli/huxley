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
