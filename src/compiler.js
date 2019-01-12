class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm

    /* 创建一个节点副本 */
    this.fragment = this.nodeToFragment(this.el)

    /* 编译节点副本 */
    this.compileElement(this.fragment)
  }

  /**
     * @param {el}: 获取到页面中的真实节点
     *
     * @desc:
     * ①：创建一个假节点;
     * ②：遍历真实节点中的每个子节点：包括文字和元素节点;
     * ③：循环子节点集合并放入假节点中;
     *
     * @return {fragment}: 包含真实节点内部所有子节点的假节点
    */
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment(),
        children = el.childNodes

    Array.from(children).forEach(node => {
      fragment.appendChild(node)
    })

    return fragment
  }

    /**
       * @param {fragment}: 假节点
       *
       * @desc:
       * ①：获取假节点的所有子节点集合;
       * ②：遍历子节点集合并对节点的类型进行判断: 1 => 元素节点 3 => 文本节点
       *    然后针对不同类型的节点选择性编译
       * ③-1(文本节点): 设定RegExp，如果文本节点中的元素带有mustache语法的双花
       *             括号，则进行文本编译;
       * ③-2(元素节点): 执行元素节点编译;
      */
  compileElement(fragment) {
    let children = fragment.childNodes
    Array.from(children).forEach(node => {
      if (node.nodeType === 1) {
        this.compileNodeElement(node)
      } else if (node.nodeType === 3) {
        this.compileTextNode(node)
      }
    })
  }
}

export default Compiler
