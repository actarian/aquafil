
export const environmentStatic = {
	flags: {
		production: false,
		cart: true,
	},
	markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
	defaultMarket: 'IT',
	currentMarket: 'IT',
	languages: ['it', 'en', 'de', 'ch'],
	defaultLanguage: 'it',
	currentLanguage: 'it',
	api: '/aquafil/api',
	assets: '/aquafil/',
	slug: {
		configureProduct: `/aquafil/products-configure.html`,
		cart: `/aquafil/cart.html`,
		reservedArea: `/aquafil/reserved-area.html`,
	},
	template: {
		modal: {
			genericModal: '/aquafil/partials/modals/generic-modal.html',
			sideModal: '/aquafil/partials/modals/side-modal.html',
			userModal: '/aquafil/partials/modals/user-modal.html',
		}
	},
	facebook: {
		appId: 610048027052371,
		fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
		scope: 'public_profile, email', // publish_stream
		tokenClient: '951b013fe59b05cf471d869aae9ba6ba',
		version: 'v11.0',
	},
	google: {
		clientId: '760742757246-61qknlmthbmr54bh7ch19kjr0sftm4q3.apps.googleusercontent.com',
	},
	linkedIn: {
		clientId: '77cg5ls5lgu3k3',
		clientSecret: 'gfBIl365EdckxCgK',
		scope: 'r_emailaddress r_liteprofile',
	},
	googleMaps: {
		apiKey: 'AIzaSyDvGw6iAoKdRv8mmaC9GeT-LWLPQtA8p60',
	},
	thron: {
		clientId: '',
	},
	workers: {
		image: './js/workers/image.service.worker.js',
		prefetch: './js/workers/prefetch.service.worker.js',
	},
	githubDocs: 'https://raw.githubusercontent.com/actarian/aquafil/main/docs/',
};
