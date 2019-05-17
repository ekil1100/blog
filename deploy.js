const util = require('util');
const sh = util.promisify(require('child_process').exec);

async function deploy(cmd) {
  const { error, stdout, stderr } = await sh(cmd);
  console.log(`$ ${cmd}`);
  if (error) {
    console.error(error);
  }
  console.log(stdout);
  console.log(stderr);
}

(async () => {
  await deploy('git checkout master');
  await deploy('git merge --no-ff dev');
  await deploy('git push origin master');
  await deploy('git checkout dev');
})();
