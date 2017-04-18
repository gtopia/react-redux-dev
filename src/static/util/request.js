module.exports = {
	requset:function(opt){
		var that = this;
		$.ajax({
		        url: opt.url,
		        data: opt.data,
		        type: opt.type,
		        dataType: opt.dataType || 'jsonp',
				xhrFields: {
				    withCredentials: true
				},
		        complete: function() {
		        	that.complete()
		        },
		        error: function() {
		            that.error();
		        },
		        timeout: opt.timeout,
		        success: function(rs) {

		        	that.success(rs);
		        }
		    });

		return that;
	},
	success:function(){

	},
	error:function(){

	},
	complete:function(){

	}
}