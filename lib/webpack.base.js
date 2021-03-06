const autoprefixer = require('autoprefixer');
const glob = require('glob');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Happypack = require('happypack');

const projectRoot = process.cwd();

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        return htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(projectRoot, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: ['vendors', pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false,
                }
            })
        );
    });

    return {
        entry,
        htmlWebpackPlugins,
    };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    module: {
        rules: [{
            test: /.js$/,
            use: [
                // 'babel-loader',
                // 'happypack/loader'
                {
                    loader: 'thread-loader',
                    options: {
                        workers: 3
                    }
                }, 
                'babel-loader?cacheDirectory=true'
            ],
            include: path.resolve('src')
        },
        {
            test: /.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
            ],
        },
        {
            test: /.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            autoprefixer({
                                browsers: ['last 2 version', '>1%', 'ios 7'],
                            }),
                        ],
                    },
                },

                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,
                        remPrecision: 8,
                    },
                },
            ],
        },
        {
            test: /.(png|jpg|gif|jpeg)$/,
            use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]',
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: { 
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        },
        {
            test: /.(woff|woff2|eot|ttf|otf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]',
                },
            },
        },
        ],
    },
    resolve: {
        alias: {
           'react': path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js'),
           'react-dom' : path.resolve(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js')
        },
        extensions: ['.js'],
        mainFields: ['main']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css',
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // function errorPlugin() {
        //     this.hooks.done.tap('done', (stats) => {
        //         if (stats.compilation.errors && process.argv.indexOf('--watch') === -1) {
        //             process.exit(1);
        //         }
        //     });
        // },
        // new Happypack({
        //     loaders: ['babel-loader']
        // })
    ].concat(htmlWebpackPlugins),
    // stats: 'errors-only',
};
