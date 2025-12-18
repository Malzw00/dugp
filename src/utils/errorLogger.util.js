function log({ layer, module, method, error, }) {

    console.log(`
        leyer: ${layer}
        module: ${module}
        method: ${method}
        error:
    `)
    console.log(error)
}


module.exports = log;