const Split = require('hendricks/lib/Split')
const hello0Template = require('./hello/0')
const cryptix0Template = require('./cryptix/0')

const hello0BranchKey = new Uint8Array([0])
const cryptix0BranchKey = new Uint8Array([1])

module.exports = new Split(1, [
  hello0BranchKey,
  cryptix0BranchKey
], [
  hello0Template,
  cryptix0Template
])
