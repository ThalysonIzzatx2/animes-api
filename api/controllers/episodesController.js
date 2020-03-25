'use strict';

var cheerio = require('cheerio'),
  request = require('request'),
  settings = require('../settings'),
  reqOptions = require('../req-options');

exports.list_all = function (req, res) {

  var terms = (typeof req.params.page == "string") ? req.params.page : (req.params.terms || "");
  var page = !isNaN(Number(req.params.page)) ? req.params.page : 1;
  var url = settings.base_path;
  var min = 12;
  console.log(url);


  request(url, reqOptions, function (error, response, body) {

    if (response.statusCode !== 200 || error) {
      res.json({
        "err": true,
        "msg": "Não foi possível carregar os lançamentos."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = null;
    var $el = $('.col-sm-6.col-md-4.col-lg-4 .well.well-sm');

    if ($el.length) {
      arr = [];
      $el.each(function (index, el) {

        let obj = {
          'title': $(el).find('.video-title').text(),
          'key': $(el).find('a').attr('href').split('/').filter(String).slice(-2).shift(),
          'slug': $(el).find('a').attr('href').split('/').filter(String).slice(-1).pop(),
          'image': $(el).find('.thumb-overlay img').attr('src'),
          'duration': $(el).find('.duration').text().trim(),
          'has_hd': !!$(el).find('.hd-text-icon').length
        };

        obj.key = obj.key + "|" + obj.slug;

        arr.push(obj);

      });
    }

    res.json({
      'length':$el.length,
      'episodes': arr

    });
  });
};


exports.video = function (req, res) {

  var key = req.params.video_key || "";
  var url = settings.base_path + "/player/" + key.replace("|", "/");

  console.log(url);

  request(url, reqOptions, function (err, response, body) {
    var $ = cheerio.load(body);

    var textNode = $('script').map((i, x) => x.children[0])
      .filter((i, x) => x && x.data.match(/jwplayer/)).get(1);


    if (textNode) {
      var scriptText = textNode.data.replace(/\r?\n|\r/g, ":")

        .match(/file: (.*?),/g).map(function (a) {
          return a.replace(/file: /g, "").slice(1, -2);
        });

      res.json({
        'video': scriptText
      });
      console.log(scriptText);





    }



  });

};