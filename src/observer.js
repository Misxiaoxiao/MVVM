import Dep from './dep.js'

/* 用于递归data */
function observer(data, vm) {
  if (!data || typeof data !== 'object') {
    return
  }
  return new Observer(data, vm)
}

/* 观察者 */
class Observer {
  constructor(data, vm) {
    this.data = data
    this.vm = vm

    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      this.bindDescriptor(data, key, data[key], this.vm)
    })
  }
  /**
   * @param {data}: data对象;
   * @param {key}: 键;
   * @param {value}: 值;
   *
   * @desc:
   * ①：获取data对象中的属性，然后放入observer中判定
   *    是否为对象，如果是对象则将该对象作为data放入一个新的
   *    观察器中;
   * ②：为属性设定descriptor，并且检测到设定的新值如果是对象，
   *    则放入一个新观测器中进行观测;
   * ③：new一个Dep实例，在属性的getter和setter中备用
   */
  bindDescriptor(data, key, value) {
    /* 递归操作 */
    let childObj = observer(value),
        dep = new Dep()
    /* 绑定getter setter */
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      /**
       * @desc: (由watcher中跳转过来)
       * 在watcher的getVMData中读取了该属性，触发get函数，
       * 然后因为此时Dep类的标的不为空(此时标的为该属性的watcher),
       * 然后执行依赖注入，此处跳转到new出来的Dep实例
       */
      get() {
        if (Dep.target) {
          dep.depend()
        }
        return value
      },
      /**
       * @desc
       * 触发setter，并且将该属性的dep实例里的subs里面的watcher
       * 全部拉出来执行其中的update回调
       */
      set(newVal) {
        if (newVal !== value) {
          value = newVal
          childObj = observer(newVal)
          dep.notify()
        }
      }
    })
  }
}

export default observer
