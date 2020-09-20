process.env.NODE_ENV !== 'development'
  ? hexo.extend.injector.register(
      'head_end',
      `<script async defer data-website-id="51f01eff-19df-4867-bfd1-df2e7112edbe" src="https://u.lastingman.com/umami.js"></script>`
    )
  : null
