// run from /dev-server:
// node main.js
// 
var
	express = require('express'),
	app = express(),
	data = require('./data'),
	server;

data.forEach(function(item, i){
	item.index = i;
});

function copy(){
	return [].concat(data);
}

function sortData(data, prop, dir){
	if(data[0][prop] === undefined){
		console.log('MISSING PROP', prop, data[0]);
		return data;
	}
	
	var
		aLess = dir === 'desc' ? -1 : 1,
		bLess = dir === 'desc' ? 1 : -1;
	
	return data.sort(function(a, b){
		if(a[prop] < b[prop]){
			return aLess;
		}
		else if(a[prop] > b[prop]){
			return bLess;
		}
		return 0;
	});
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
	console.log('req', req.query);
	var
		options = req.query || {},
		filter = options.filter,
		sort = options.sort,
		dir = options.dir === 'asc' ? 'asc' : 'desc',
		start = +(options.start || 0),
		count = +(options.count || 10),
		end = count,
		json,
		data = copy(),
		result = {
			start: start,
			count: count,
			total: data.length,
			sort: sort,
			dir: dir
		};
		
	console.log('options', result);
	
	console.log('first', data[0].firstName);
	
	if(sort){
		data = sortData(data, sort, dir);
	}
	
	console.log('first', data[0].firstName);
	
	result.items = data.splice(start, end);
	
	
	console.log('first', data[0].firstName);
	
	if(filter){
		filter = filter.split(',');
		result.items = result.items.map(function(item){
			var filtereditem = {};
			filter.forEach(function(key){
				filtereditem[key] = item[key];
			});
			return filtereditem;
		});
	}
	
	console.log('ITEMS', result.items.length);
	
	json = JSON.stringify(result);
	res.send(json);
});

server = app.listen(3000, function () {
	
	var
		host = server.address().address,
		port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port);

});