class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm

    /* 创建一个节点副本 */
    this.fragment = this.nodeToFragment(this.el)

    /* 编译节点副本 */
    this.compileElement(this.fragment)

    /* 插入文本 */
    this.el.appendChild(this.fragment)
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

  /**
     * @param {textNode}: 文本节点
     *
     * @desc:
     * ①：创建标的tokens(标的是一个数组，内部为文本切割后的结果)，假元素，获取文本节点父元素；
     * ②：遍历tokens，若不是tag则以此创建一个文本节点，
     *    如为tag则创建一个空的文本节点并放入指令集中
     *    依据tag进行填充；
     * ③：将文本节点放入假节点中并替换原先的文本节点
     *
    */
  compileTextNode(textNode) {
    let textList = this.compilerText(textNode.textContent),
        fragment = document.createDocumentFragment(),
        parent = textNode.parentNode;
        textList.forEach(text => {
          let el
          /* 如果是tag类型进行text取值 */
          if (text.tag) {
            el = document.createTextNode('')
            /* 传入空文本点el，当前vm，tag文本，绑定类型 */
            directives.text(el, this.vm, text.value, 'text')
          } else {
            el = document.createTextNode(text.value)
          }
          fragment.appendChild(el)
        })
        parent.replaceChild(fragment, textNode)
  }

  /**
     * @param {text}: 文本节点内文字
     *
     * @desc:
     * ①：主要内容为对文本进行切割，切割格式如下:
     *    普通文本|mustache语法文本|普通文本
     * ②：切割完毕后符合mustche语法的文本则为tag；
     * ③：将所有切割后的文本放入tokens中
     *
     * @return {tokens}
     */
  compilerText(text) {
    let mustacheRe = /\{\{(.*?)\}\}/g,
        lastIndex = 0,
        textList = [],
        match, value;

    while(match = mustacheRe.exec(text)) {
      /* 得到{{...}}前的普通文本放进textList中 */
      if (match.index > lastIndex) {
        textList.push({
          value: text.slice(lastIndex, match.index)
        })
      }

      /* 将{{...}}里的键名作为tag传入textList中 */
      value = match[1]
      textList.push({
        value,
        tag: true
      })

      /* 将lastIndex置为该{{...}}之后 */
      lastIndex = match.index + match[0].length
    }
    /* 将剩余普通文本内放入textList */
    if (lastIndex < text.length) {
      textList.push({
        value: text.slice(lastIndex)
      })
    }

    return textList
  }

  /**
     * @param {node}: 元素节点
     *
     * @desc:
     * ①：获取该元素节点的子节点和它的属性;
     * ②：遍历属性列表然后判断属性中是否存在指令病过滤出该指令，
     *    代入指令集中进行处理
    */
  compileNodeElement(node) {
    let children = node.childNodes,
        attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      /* 获取属性名字 */
      let name = attr.name
      /* 判断是否存在指令 */
      if (name.indexOf('v-') > -1) {
        /* 获取指令的值和类型 */
        let value = attr.value,
            type = name.substring(2);
        directives[type](node, this.vm, value, type)
      }
    })
    if (children && children.length > 0) {
      this.compileElement(node)
    }
  }
}

const directives = {
  text(node, vm, exp, type) {
    this.bind(node, vm, exp, type)
  },
  model(node, vm, exp, type) {
    this.bind(node, vm, exp, type)
  },
  /* 根据类型来统一绑定数据 */
  bind(node, vm, exp, type) {
    let newVal = this.getVMData(vm, exp)
    updater[type](node, exp, newVal)
  },
  /* 用于获取data中的值 */
  getVMData(vm, exp) {
    let expArr = exp.split('.'),
        val = vm
    expArr.forEach(key => {
      val = val[key]
    })
    return val
  }
}

const updater = {
  /* 更新文本类型 */
  text(node, exp, val) {
    node.textContent = val
  },
  /* v-model */
  model(node, exp, val) {
    node.value = val
  }
}

export default Compiler
