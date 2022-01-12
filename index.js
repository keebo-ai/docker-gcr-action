const core = require('@actions/core');
const exec = require('@actions/exec')

async function run() {
    try {
        const oauth2AccessToken = core.getInput("OAUTH2_ACCESS_TOKEN", {required: true})
        const host = core.getInput('HOST', {required: true})

        let myOutput = '';
        let myError = '';

        const options = {
            silent: true
        }
        options.listeners = {
            stdout: (data) => {
                myOutput += data.toString();
            },
            stderr: (data) => {
                myError += data.toString();
            }
        };

        const registry = 'https://' + host

        console.log(`Logging into ${registry}`)

        await exec.exec('docker', ['login', '-u', 'oauth2accesstoken', '-p', oauth2AccessToken, registry], options)
            .then(() => {console.log(myOutput)})
            .catch(() => {throw {message: myError}})
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
