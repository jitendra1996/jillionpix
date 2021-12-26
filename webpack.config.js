const path =require("path");

module.exports = {
    entry : ['babel-polyfill','./src/js/index.js'],
    output : {
        path : path.resolve(__dirname , 'public'),
        filename : 'js/bundle.js'
    },
    devServer : {
        static : './public'
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude: /node_modules/,
                use : {
                    loader : 'babel-loader'
                }
            }
        ]
    }
}