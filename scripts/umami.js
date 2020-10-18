process.env.NODE_ENV !== 'development'
  ? hexo.extend.injector.register(
      'head_end',
      `<script async defer data-website-id="b4572a19-f8c0-49fa-9dd5-bc4b5cc9c226" src="https://u.lastingman.com/umami.js"></script>`
    )
  : null
