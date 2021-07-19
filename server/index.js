const next        = require("next")
const express     = require("express")
// const nextI18next = require('../i18n')
// const nextI18NextMiddleware = require('next-i18next/dist/commonjs/middlewares')

const PORT    = parseInt(process.env.PORT, 10) || 8000
const dev     = process.env.NODE_ENV !== 'production'
const app     = next({ dir: '.', dev })
const handle  = app.getRequestHandler(app)


app.prepare().then(() => {
	const server = express()
	
	// server.use(nextI18NextMiddleware(nextI18next))
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json())

	// Index page
	server.get('/', (req, res) => {
		return app.render(req, res, '/index', { lang: req.language })
	})

	// Result single page
	server.get('/result/:order', (req, res) => {
		return app.render(req, res, '/result', { order: req.params.order })
	})
	
	server.post('*', (req, res) => {
		return handle(req, res)
	})

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(PORT, () => process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`))
})
