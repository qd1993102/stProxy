var config = {
	port: 8000,
	task: {
		local: {
			url: "http://sc.waptest.taobao.com/build/",
			debug: true
		},
		online: {
			url: "http://s1.bdstatic.com/r/www/cache/static/global/js/",
			debug: true
		}
	},
	current: "local"
};


module.exports = config;