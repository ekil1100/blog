hexo.extend.tag.register('cdn', function(args) {
  let filename = args[0]
  return `<img src="${hexo.config.cdn}${filename}" alt="${filename}">`
})
