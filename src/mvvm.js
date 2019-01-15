import Compiler from './Compiler.js'
import observer from './Observer.js'

class MVVM {
  constructor(options) {
    this.el = options.el
    this.data = options.data

    /* 将data的属性代理到当前vm对象中 */
    Object.keys(this.data).forEach(key => {
      this.setProxy(key)
    })

    observer(this.data, this)
    /* 编译节点 */
    new Compiler(this.el, this)
  }

  /*
   * @param {key}: data对象中的每一个key
   *
   * @desc: 针对data对象中的每个元素设置代理
   * 目标: vm.data.xxx => vm.xxx
   */
  setProxy(key) {
    let _this = this
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get() {
        return _this.data[key]
      },
      set(newVal) {
        _this.data[key] = newVal
      }
    })
  }
}

export default MVVM
