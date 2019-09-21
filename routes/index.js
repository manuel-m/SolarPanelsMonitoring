/*
 * GET home page.
 */

exports.index = function(req, res) {
  const params = {
    title: 'Express',
    current_date: new Date().toLocaleString() /*[!!!] non polled value*/,
  };
  res.render('index', params);
};
