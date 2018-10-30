const Node = require('./Node')
const auclientEnvelopeTemplate = require('./templates/auclient/envelope')
const auserverEnvelopeTemplate = require('./templates/auserver/envelope')
const nacl = require('tweetnacl')

module.exports = class Client extends Node {
  constructor(keypair, rootPublicKey) {
    super(auclientEnvelopeTemplate, auserverEnvelopeTemplate, keypair)
    this.rootPublicKey = rootPublicKey
  }

  getHello0Value() {
    return this.keypair.publicKey
  }

  handleHello0Value(value) {
    if (this.counterpartyPublicKey) {
      this.stop(new Error('Already received counterparty hello'))
    }
    const serverPublicKey = value[0]
    const rootSignature = value[1]
    if (!nacl.sign.detached.verify(serverPublicKey, rootSignature, this.rootPublicKey)) {
      this.stop(new Error('Could not verify server public key'))
    }
    this.counterpartyPublicKey = serverPublicKey
  }
}
