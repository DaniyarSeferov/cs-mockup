const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const glob = require("glob");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}

	return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true
			}
		},
		'css-loader'
	];

	if (extra) {
		if (extra === 'sass-loader') {
			extra = {
				loader: 'sass-loader',
				options: {
					prependData: `@import "./src/common/settings.scss";`
				}
			};
		}

		loaders.push(extra);
	}

	return loaders;
}

const plugins = () => {
	const pluginsArr = [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/images'),
				to: path.resolve(__dirname, 'dist/images')
			}
		]),
		new MiniCssExtractPlugin({
			filename: './css/' + filename('css')
		})
	];

	let pages = glob.sync(__dirname + '/src/pages/*.pug');
	pages.forEach(function (file) {
		let base = path.basename(file, '.pug');

		pluginsArr.push(
			new HTMLWebpackPlugin({
				filename: 'pages/' + base + '.html',
				template: './pages/' + base + '.pug',
				inject: true
			})
		)
	});

	return pluginsArr;
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.js']
	},
	output: {
		filename: './js/' + filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		alias: {
			'@models': path.resolve(__dirname, 'src/models'),
			'@': path.resolve(__dirname, 'src')
		}
	},
	optimization: optimization(),
	devServer: {
		port: 4200,
		hot: isDev
	},
	devtool: isDev ? 'source-map' : '',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [{
					loader: 'pug-loader',
					options: {
						pretty: isDev
					}
				}]
			},
			{
				test: /\.css$/,
				use: cssLoaders()
			},
			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader')
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				exclude: /fonts/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						publicPath: '../images/',
						outputPath: './images/'
					}
				}
			},
			{
				test: /\.(ttf|woff|woff2|eot|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						publicPath: '../fonts/',
						outputPath: './fonts/'
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env'
						]
					}
				}
			}
		]
	}
}