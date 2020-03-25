'use strict';

var cheerio = require('cheerio'),
  request = require('request'),
  settings = require('../settings'),
  reqOptions = require('../req-options');

exports.list_all = function (req, res) {
  var page = !isNaN(Number(req.params.page)) ? req.params.page : 1;
  var url = settings.base_path + "/anime/page/" + page;
  var min = 10;
  request(url, reqOptions, function (error, response, body) {

    if (response.statusCode !== 200 || error) {
      res.json({
        "err": true,
        "msg": "Não foi possível carregar os animes."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = [];
    var $el = $('#wrapper .col-lg-3.col-md-4.col-sm-6.col-xs-12');

    $el.each(function (index, el) {


      arr.push({

        'title': $(this).find('.internalUrl').attr('href').split('/').slice(-1).pop(),
        'image': $(this).find('.img-responsive').attr('src'),
        'slug': $(this).find('.internalUrl').attr('href')

      });

    });

    res.json({
      'length': $el.length,
      'nextPage': $el.length < min ? false : Number(page) + 1,
      'animes': arr,

    });
  });
};