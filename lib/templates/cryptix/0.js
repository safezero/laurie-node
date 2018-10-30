const Dictionary = require('hendricks/lib/Dictionary')
const Fixed = require('hendricks/lib/Fixed')
const box0Template = require('../nacl/box/0')

module.exports = new Dictionary([new Fixed(24), box0Template])
