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
  await deploy('git add .');
  await deploy('git commit -m "update"');
  await deploy('git push');
})();
