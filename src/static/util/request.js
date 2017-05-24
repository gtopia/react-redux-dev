module.exports = {
	request: function(opt) {
		var _this = this;

		$.ajax({
	        url: opt.url,
	        data: opt.data || {},
	        type: opt.type,
	        dataType: opt.dataType || 'jsonp',
			xhrFields: {
			    withCredentials: true
			},
            timeout: opt.timeout,
            success: function(res) {
                _this.success(res);
            },
	        error: function() {
	            _this.error();
	        },
            complete: function() {
                _this.complete();
            }
	    });

		return _this;
	},
	success: function() {
	},
	error: function() {
	},
	complete: function() {
	}
};
