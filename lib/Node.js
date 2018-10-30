const Emitter = require('events')
const nacl = require('tweetnacl')

module.exports = class Node {
  constructor(partyTemplate, counterpartyTemplate, keypair) {
    this.partyTemplate = partyTemplate
    this.counterpartyTemplate = counterpartyTemplate
    this.keypair = keypair

    this.isStarted = false
    this.isStopped = false
    this.emitter = new Emitter

    this.emitter.on('envelope.in', this.handleEnvelopeEncoding.bind(this))
    this.subjectNumber = 0
  }

  sendEnvelopeEncoding(encoding) {
    this.emitter.emit('envelope.out', encoding)
  }

  getHello0Encoding() {
    return this.partyTemplate.encode([new Uint8Array([0]), this.getHello0Value()])
  }

  sendHello0() {
    this.sendEnvelopeEncoding(this.getHello0Encoding())
  }

  handleEnvelopeEncoding(envelopeEncoding) {
    if (this.isStopped) {
      throw new Error('Laurie client stopped')
    }

    let envelopeValue
    try {
      envelopeValue = this.counterpartyTemplate.decode(envelopeEncoding)
    } catch (err) {
      this.stop(err)
    }
    const key = envelopeValue[0]
    const value = envelopeValue[1]

    switch(key[0]) {
      case 0:
        this.handleHello0Value(value)
        break;
      case 1:
        this.handleCryptix0Value(value)
        break;
    }
  }

  getCryptix0Encoding(plaintext) {
    const nonce = nacl.randomBytes(24)
    return this.partyTemplate.encode([
      new Uint8Array([1]),
      [nonce, this.getBox(plaintext, nonce)]
    ])
  }

  sendCryptix0Plaintext(plaintext) {
    const nonce = nacl.randomBytes(24)
    const box = nacl.box(plaintext, nonce, this.counterpartyPublicKey, this.keypair.secretKey)
    const envelopeEncoding = this.partyTemplate.encode([
      new Uint8Array([1]),
      [nonce, box]
    ])
    this.sendEnvelopeEncoding(envelopeEncoding)
  }

  handleCryptix0Value(cryptixValue) {
    const nonce = cryptixValue[0]
    const box = cryptixValue[1]
    const plaintext = nacl.box.open(box, nonce, this.counterpartyPublicKey, this.keypair.secretKey)

    this.emitter.emit('plaintext.in', plaintext)
  }

  stop(error) {
    this.isStopped = true
    throw error
  }
}
