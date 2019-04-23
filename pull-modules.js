const util = require('util')
const fs = require('fs')
const sh = util.promisify(require('child_process').exec)

async function deploy(cmd) {
  const { error, stdout, stderr } = await sh(cmd)
  console.log(`$ ${cmd}`)
  if (error) {
    console.error(error)
  }
  console.log(stdout)
  console.log(stderr)
}

;(async () => {
  if (!fs.existsSync('themes/next'))
    await deploy('git clone https://github.com/theme-next/hexo-theme-next.git themes/next')
  if (!fs.existsSync('themes/next/source/lib/Han'))
    await deploy('git clone https://github.com/theme-next/theme-next-han.git themes/next/source/lib/Han')
  if (!fs.existsSync('themes/next/source/lib/pangu'))
    await deploy('git clone https://github.com/theme-next/theme-next-pangu.git themes/next/source/lib/pangu')
  if (!fs.existsSync('themes/next/source/lib/reading_progress'))
    await deploy(
      'git clone https://github.com/theme-next/theme-next-reading-progress.git themes/next/source/lib/reading_progress'
    )
  if (!fs.existsSync('themes/next/source/lib/fancybox'))
    await deploy('git clone https://github.com/theme-next/theme-next-fancybox3.git themes/next/source/lib/fancybox')
})()
