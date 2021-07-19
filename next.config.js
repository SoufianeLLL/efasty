const webpack = require('webpack')

module.exports = {
	publicRuntimeConfig: {
		localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
		  ? process.env.LOCALE_SUBPATHS
		  : 'none',
	},
	webpack: (config, { isServer }) => {
		if ( !isServer ) {
			config.node = {
				fs: 'empty',
				tls: 'empty',
				net: 'empty'
			}
		}
		const env = Object.keys(process.env).reduce((acc, curr) => {
			acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
			return acc
		}, {})
		config.plugins.push(new webpack.DefinePlugin(env))
		return config
	}
}
