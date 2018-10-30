const Node = require('./Node')
const auclientEnvelopeTemplate = require('./templates/auclient/envelope')
const auserverEnvelopeTemplate = require('./templates/auserver/envelope')

module.exports = class Server extends Node {
  constructor(keypair, rootSignature) {
    super(auserverEnvelopeTemplate, auclientEnvelopeTemplate, keypair)
    this.rootSignature = rootSignature
  }

  getHello0Value() {
    return [this.keypair.publicKey, this.rootSignature]
  }

  handleHello0Value(value) {
    if (this.counterpartyPublicKey) {
      this.stop(new Error('Already received counterparty hello'))
    }
    this.counterpartyPublicKey = value
    this.sendHello0()
  }
}
