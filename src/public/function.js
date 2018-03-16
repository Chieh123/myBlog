class clientFunction {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
  checkIsEmpty () {
    let self = this
    var title = String(self.req.query.title)
    var author = String(self.req.query.author)
    var content = String(self.req.query.content)
    title = title.trim() // 去除頭尾空白
    author = author.trim() // 去除頭尾空白
    content = content.trim() // 去除頭尾空白
    if (title.length === 1) {
      console.log('no title')
      alert('Please type title')
      return true
    } else if (content.length === 1) {
      console.log('no content')
      alert('Please type content')
      return true
    } else if (author.length === 1) {
      console.log('no author')
      alert('Please type author')
      return true
    } else {
      return false
    }
  }
}
module.exports = clientFunction
