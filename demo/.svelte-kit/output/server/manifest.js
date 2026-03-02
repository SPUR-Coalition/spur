export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CYsoxWgM.js",app:"_app/immutable/entry/app.CZzBnMUW.js",imports:["_app/immutable/entry/start.CYsoxWgM.js","_app/immutable/chunks/XK_MJBad.js","_app/immutable/chunks/Dc4giFSC.js","_app/immutable/chunks/Dqa1VYvl.js","_app/immutable/chunks/C8Tb2JJ_.js","_app/immutable/entry/app.CZzBnMUW.js","_app/immutable/chunks/Dc4giFSC.js","_app/immutable/chunks/DfuC10zz.js","_app/immutable/chunks/BdjEoq95.js","_app/immutable/chunks/C8Tb2JJ_.js","_app/immutable/chunks/btj0KlJc.js","_app/immutable/chunks/COo7Qzdj.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/chat",
				pattern: /^\/api\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/chat/_server.ts.js'))
			},
			{
				id: "/api/publisher",
				pattern: /^\/api\/publisher\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/publisher/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
