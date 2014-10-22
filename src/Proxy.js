var BufferHelper = require('bufferhelper');
var Q = require('q');
var http = require('http');
var config = require('./config.js');
var url = require('url');



function rename(fileName){
	var fileInfo = fileName.split('.');
	var ext = fileInfo[fileInfo.length - 1];
	var name = fileInfo.slice(0, fileInfo.length - 1).join('.');
	if(config.task[config.current].debug){//if debug
		name += '.debug'
	}
	return name + '.' + ext;
}


/**
 * [sendRequest base on config, send the request]
 * @return {[type]} [description]
 */
function sendRequest(){
	var args = [].slice.call(arguments);
	var request = args[0];
	var response = args[1];
	var postData = new BufferHelper();

	var urlArgs = request.url.split('/');
	//获取文件名字
	var fileName = urlArgs[urlArgs.length - 1];
	var task = config.task[config.current];
	//解析url
	var newOpts = url.parse(task.url + rename(fileName));

	newOpts.header = request.header;
	newOpts.method = request.method;
	newOpts.agent = request.agent;

	var req = http.request(newOpts, function(res){
		var bufferhelper = new BufferHelper();
		res.on('data', function(chunk){
			bufferhelper.concat(chunk);
		});
		res.on('end', function(){
			response.writeHead(200, {
				'Content-type': 'text/plain;charset=utf-8'
			});
			response.end(bufferhelper.toBuffer().toString());
		});
		
	});

	request.on('data', function(chunk){
		postData.concat(chunk);
	});
	request.on('end', function(){
		req.write(postData.toBuffer().toString());
		req.end();
	});

}

/**
 * [start start the server]
 * @return {[type]} [description]
 */
function start(){
	var deferred = Q.defer();
	http.createServer(function(request, response){
		console.log('start the server, listening the port ' + config.port);
		var opts = {
			header: request.header,
			method: request.method,
			agent: request.agent
		};
		/**
		 * send the request to destination
		 */
		sendRequest(request, response);
		
	}).listen(config.port);
}


start();
