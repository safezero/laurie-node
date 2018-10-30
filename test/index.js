const nacl = require('tweetnacl')
const Client = require('../lib/Client')
const Server = require('../lib/Server')

const rootKeypair = nacl.sign.keyPair()
const serverKeypair = nacl.box.keyPair()
const clientKeypair = nacl.box.keyPair()

describe('client/server', () => {
  let rootKeypair, serverKeypair, clientKeypair, client

  it('should create keypairs', () => {
    rootKeypair = nacl.sign.keyPair()
    serverKeypair = nacl.box.keyPair()
    clientKeypair = nacl.box.keyPair()
  })
  it('should create client', () => {
    client = new Client(clientKeypair, rootKeypair.publicKey)
  })
  it('should create server', () => {
    server = new Server(serverKeypair, nacl.sign.detached(serverKeypair.publicKey, rootKeypair.secretKey))
  })
  it('should bind', () => {
    client.emitter.on('envelope.out', (encoding) => { server.emitter.emit('envelope.in', encoding) })
    server.emitter.on('envelope.out', (encoding) => { client.emitter.emit('envelope.in', encoding) })
  })
  it('client should letter0', () => {
    client.sendHello0()
  })
  it('client.counterpartyPublicKey should be server.keypair.publicKey', () => {
    client.counterpartyPublicKey.should.deep.equal(server.keypair.publicKey)
  })
  it('server.counterpartyPublicKey should be client.keypair.publicKey', () => {
    server.counterpartyPublicKey.should.deep.equal(client.keypair.publicKey)
  })
  it('client should sendCryptix0Plaintext and server should receive', (done) => {
    const plaintext = new Uint8Array([0, 1, 2, 3])
    server.emitter.on('plaintext.in', (_plaintext) => {
      try {
        _plaintext.should.deep.equal(plaintext)
      } catch (err) {
        done(err)
      }
      done()
    })
    client.sendCryptix0Plaintext(plaintext)
  })
  it('server should sendCryptix0Plaintext and client should receive', (done) => {
    const plaintext = new Uint8Array([4, 5, 6, 7])
    client.emitter.on('plaintext.in', (_plaintext) => {
      try {
        _plaintext.should.deep.equal(plaintext)
      } catch (err) {
        done(err)
      }
      done()
    })
    server.sendCryptix0Plaintext(plaintext)
  })
})
