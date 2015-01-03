define([], function(){
	
	return function xhr(url, callback, errback){
		var
			req = new XMLHttpRequest();
		
		function onload(request) {
			var req = request.currentTarget, result, err;
	
			if(req.status !== 200){
				err = {
					status: req.status,
					message: req.statusText,
					request:req
				};
				errback(err);
			}
			else {
				try{
					result = JSON.parse(req.responseText);
				}catch(e){
					console.error('XHR PARSE ERROR:', req.responseText);
					errback(e);
					// return?
				}
				callback(result || req.responseText);
			}
		}
		
		req.onload = onload;
		req.open('GET', url, true);
		req.setRequestHeader('Accept', 'application/json');
		
		req.send();
	};
	
});