'use strict';

function cdn(args) {
  args = args.join(' ').split(',');
  let img = args[0];
  let id = args[1] || false;
  let title = args[2] || '';
  return id
    ? `<img src="${hexo.config.gateway}${img}" alt="${title}">`
    : `<img src="${hexo.config.cdn}${this.slug}/${img}" alt="${title}">`;
}

hexo.extend.tag.register('cdn', cdn);

function fullImageCdn(args) {
  args = args.join(' ').split(',');
  var mixed = args[0].split('@');
  var img = `${hexo.config.cdn}${this.slug}/${mixed[0]}`;
  var src = mixed[1] === 'lazy' ? '/images/loading.gif" data-original="' + img : img;
  var alt = args[1] || '';
  var title = args[2] || '';
  var width = args[3] || '';

  if (!img) {
    hexo.log.warn('Image src can NOT be empty');
  }

  var image = [
    `<span itemprop="image" itemscope itemtype="http://schema.org/ImageObject"><img itemprop="url image" src="${src}" class="full-image"`
  ];
  alt.length > 0 && image.push(`alt="${alt.trim()}"`);
  title.length > 0 && image.push(`title="${title.trim()}"`);
  width.length > 0 && image.push(`style="max-width: none; width:${width};"`);
  image.push('/><meta itemprop="width" content="auto"/><meta itemprop="height" content="auto"/></span>');

  return image.join(' ');
}

hexo.extend.tag.register('cdnfi', fullImageCdn);
