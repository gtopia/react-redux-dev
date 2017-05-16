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
	        complete: function() {
	        	_this.complete();
	        },
	        error: function() {
	            _this.error();
	        },
	        timeout: opt.timeout,
	        success: function(rs) {

	        	_this.success(rs);
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
