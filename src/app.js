import MVVM from './mvvm.js'

let vm = new MVVM({
  el: '#app',
  data: {
    msg: '123',
    message: {
      name: '456'
    }
  }
})
