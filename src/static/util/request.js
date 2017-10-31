module.exports = {
	request: function(opt, successCb, errorCb, completeCb) {
		$.ajax({
	        url: opt.url,
	        data: opt.data || {},
	        type: opt.type || 'GET',
	        dataType: opt.dataType || 'jsonp',
			xhrFields: {
			    withCredentials: true
			},
            timeout: opt.timeout,
            success: function(res) {
                if (successCb && typeof successCb === 'function') {
                    successCb(res);
                }
            },
	        error: function() {
                if (errorCb && typeof errorCb === 'function') {
                    errorCb();
                }
	        },
            complete: function() {
                if (completeCb && typeof completeCb === 'function') {
                    completeCb();
                }
            }
	    });
	}
};
