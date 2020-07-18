const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const glob = require("glob");
const fs = require('fs');
const webpack = require('webpack');

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

const filename = ext => !isDev ? `[name].${ext}` : `[name].[hash].${ext}`

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
			},
			{
				from: path.resolve(__dirname, 'src/vendor'),
				to: path.resolve(__dirname, 'dist/vendor')
			}
		]),
		new MiniCssExtractPlugin({
			filename: './css/' + filename('css')
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		})
	];

	const pages = [];

	fs.readdirSync(path.resolve(__dirname, 'src/pages'))
		.filter((file) => {
			return file.indexOf('base') !== 0;
		})
		.forEach((file) => {
			pages.push(file.split('/', 2));
		});

	const htmlPlugins = pages.map(fileName => new HtmlWebpackPlugin({
		getData: () => {
			try {
				return JSON.parse(fs.readFileSync(`./src/pages/${fileName}/data.json`, 'utf8'));
			} catch (e) {
				console.warn(`data.json was not provided for page ${fileName}`);
				return {};
			}
		},
		filename: `${fileName}.html`,
		template: `./pages/${fileName}/${fileName}.pug`,
		alwaysWriteToDisk: true,
		inject: 'body',
		hash: true,
	}));

	return pluginsArr.concat(htmlPlugins);
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './entry.js']
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
		hot: isDev,
		contentBase: 'dist'
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
				exclude: /images/,
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