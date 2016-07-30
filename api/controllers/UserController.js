/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index' : function(req, res, next) {
		if(req.session.authenticated) {
			console.log(req.session.uid);
			//console.log('here in index'+req.session.id);
			User.findOne({id:req.session.uid},function(err, result){
				//console.log('here in model method'+result);
				res.view('user/index',{obj:req.session.search,
										userobj:result});				
			});				
		}
		else {
			res.view('user/index',{obj:req.session.search,
									userobj:{}});
		}
	},

	'new' : function(req,res,next){
		res.view();
	},

	'create' : function(req,res,next) {

		var password = req.param('password');
		User.getHash(password, function(err,encpass){
			if(err)
				return console.log(err);
			req.params.encpass = encpass;
			//creating.
			User.create(req.params.all(),function(err, user){
				if(err) { console.log(err); }
				else { 
					req.session.uid = user.id;
					var skipobj = req.file('fileup');
					var path = 'avatar/';
					filefun.upload(skipobj, user.id, User, path );
					res.redirect('session/new'); 
				}

			});
		});
	

	},
	'show' : function(req, res , next) {
		User.findOne(req.param('id'), function(err, user){
			res.view({
				user : user
			});
		});
	},

	'edit' : function(req, res, next) {
		//step 1 : if avatar is submitted execute below code.
		//step 2: if details need to be updated, then the next one is submitted.



/*		if(req.param('submit')) {
			//comparing old password with the entered old password.
			var enhashprom = User.gethash(req.param('oldpassword'));
			enhashprom.then(enhashpass) {

			}*/
			User.findOne({id:req.session.uid},function(err, result){
					res.view('user/edit',{userobj:result});				


		});
			
		
	},
	'destroy' : function(req, res, next) {
		req.session.destroy();
		res.redirect('static/index');
	},

	//temporary
	'test' : function(req, res, next) {
		console.log(req.param('submit'));
			res.view();
	}
};

