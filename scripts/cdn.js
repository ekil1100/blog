'use strict'

function cdn(args) {
  let filename = args[0]
  return `<img src="${hexo.config.cdn}${this.slug}/${filename}" alt="${filename}">`
}

hexo.extend.tag.register('cdn', cdn)
