'use strict';

var cheerio = require('cheerio'),
  request = require('request'),
  settings = require('../settings'),
  reqOptions = require('../req-options');

exports.list_all = function (req, res) {

  var url = settings.base_path + "/genero";

  request(url, reqOptions, function (error, response, body) {

    if (response.statusCode !== 200 || error) {
      res.json({
        "err": true,
        "msg": "Não foi possível carregar as categorias."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = [];
    $('#wrapper .list-group-item').each(function (index, el) {
      arr.push({
        'title': $(this).text().trim(),
        'slug': $(this).attr('href').split('/').filter(String).slice(-1).pop()
      })
    });

    res.json({
      'length':$.length,
      'category': arr
    });
  });
};