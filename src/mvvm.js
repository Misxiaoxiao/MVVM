import Compiler from './Compiler.js'

class MVVM {
  constructor(options) {
    this.el = options.el
    this.data = options.data

    /* 将data的属性代理到当前vm对象中 */
    Object.keys(this.data).forEach(key => {
      this.setProxy(key)
    })
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
    Object.defineProperty(this, key, {
      get() {
        return this.data[key]
      },
      set(newVal) {
        this.data[key] = newVal
      }
    })
  }
}

export default MVVM
