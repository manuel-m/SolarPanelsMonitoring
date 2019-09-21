
/*
 * GET home page.
 */

// test modif

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};