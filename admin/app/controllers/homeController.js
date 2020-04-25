var env = require('../../config/env');

exports.index = function (req, res) {
    
    if (req.cookies.snt){
        res.render('index');
    } else {
        res.redirect('login');
    }
    
    
}

exports.apiInfo = function(req, res, next){

    res.json(env);    
    
}