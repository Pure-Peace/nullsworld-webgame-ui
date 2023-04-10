const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                }
            ]
        }
    },
    css: {
        extract: IS_PROD,
        loaderOptions: {
            less: {
                modifyVars: {

                },
                javascriptEnabled: true
            }
        }
    }

}
