import { Loading } from 'element-ui'

const loading = {
  count: 0,
  loading: null,
  start () {
    this.count += 1 // 只要有请求 就加一
    if (!this.loading) { // 第一次，进入
      setTimeout(() => {
        // 没有开启loading，并且请求大于1
        if (!this.loading && this.count > 0) {
          // 设置已经开启loading
          this.checkLoading()
        }
      }, 100)
    }
  },
  close () {
    this.count -= 1
    setTimeout(() => {
      // 没有开启loading，并且请求大于1
      if (this.count <= 0) {
        this.done()
      }
    }, 100)
  },
  // 全部结束，让loading消失
  done () {
    this.count = 0
    if (this.loading) {
      this.loading.close()
      this.loading = null
    }
  },
  // 没有loading 就创建一个
  checkLoading () {
    // 获取 loading dom
    const el = document.querySelector('.dmc-loading')
    // 没有这个loading
    if (!this.loading && !el) {
      // 创建 loading
      this.loading = Loading.service({
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'dmc-loading'
      })
    }
  }
}

export default loading
