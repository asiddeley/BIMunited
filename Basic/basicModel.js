///////////////////
//
// Andrew Siddeley
// 17-Dec-2016

define(
	//Dependencies
	['sylvester'], 
 
	//Factory function
	function(sy) {
		return {
			disc:'All',
			name:'Basic model',
			parts:[],
			tags:[],
			tools:[],
			views:[],
			visit:function(visitor){visitor.welcome(this);},			
			xyz:sy.V([1,2,3])			
		};
	}
);