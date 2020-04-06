const ChainedMap = require('webpack-chain/src/ChainedMap')
const Orderable = require('webpack-chain/src/Orderable')

module.exports = Orderable(class Plugin extends ChainedMap {
  constructor (parent) {
    super(parent)
    this.extend(['init'])

    this.init((plugin, args = []) => ({ plugin, args }))
  }

  use (plugin, args = []) {
    return this
      .set('plugin', plugin)
      .set('args', args)
  }

  tap (f) {
    this.set('args', f(this.get('args') || []))
    return this
  }

  merge (object, omit = []) {
    if ('plugin' in object) {
      this.set('plugin', object.plugin)
    }

    if ('args' in object) {
      this.set('args', object.args)
    }

    return super.merge(object, [...omit, 'args', 'plugin'])
  }

  toConfig () {
    const init = this.get('init')

    return init(this.get('plugin'), this.get('args'))
  }
})
