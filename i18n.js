const NextI18Next = require('next-i18next').default


module.exports = new NextI18Next({
	browserLanguageDetection: true,
	serverLanguageDetection: false,
	defaultLanguage: 'en',
	// otherLanguages: [ 'en' ],
	detection: {
		lookupCookie: 'next-i18next',
		order: ['cookie', 'querystring', 'localStorage', 'path', 'subdomain'],
		caches: ['cookie'],
	},
	localePath: typeof window === 'undefined' ? 'public/locales' : 'locales'
})
