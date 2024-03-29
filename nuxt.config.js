module.exports = {
	mode: 'spa',
	/*
  ** Headers of the page
  */
	head: {
		title: 'Biology Graduation Party',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Website for Mrs Mona\'s graduation party' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
		]
	},
	rootDir: `${process.cwd()}/client`,
	srcDir: `${process.cwd()}/client`,
	pageTransition: {
		name: 'default',
		mode: 'out-in'
	},
	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#00f' },
	/*
  ** Global CSS
  */
	css: [
	],
	/*
  ** Plugins to load before mounting the App
  */
	plugins: [
	],
	/*
  ** Nuxt.js dev-modules
  */
	buildModules: [],
	/*
  ** Nuxt.js modules
  */
	modules: [
		// Doc: https://bootstrap-vue.js.org
		'bootstrap-vue/nuxt',
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios'
	],
	/*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
	axios: {
		baseURL: '/',
		progress: true
	},
	/*
  ** Build configuration
  */
	build: {
		/*
    ** You can extend webpack config here
    */
		extend (config, ctx) {
		}
	}
};
