'use strict';

var cheerio = require('cheerio'),
    request = require('request'),
    settings = require('../settings'),
    reqOptions = require('../req-options');

exports.episodes = function (req, res) {
    var slug = req.params.slug || "";
    var page = !isNaN(Number(req.params.page)) ? req.params.page : 1;
    var url = settings.base_path + "/animes-dublado/" + slug + "/page/" + page;
    var min = 12;

    console.log(url);

    request(url, reqOptions, function (error, response, body) {

        if (response.statusCode !== 200 || error) {
            res.json({
                "err": true,
                "msg": "Não foi possível carregar as informações."
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


                arr.push(obj);

            });
        }

        res.json({
            'nextPage': $el.length < min ? false : Number(page) + 1,
            'prevPage': Number(page) > 1 ? Number(page) - 1 : false,
            'episodes': arr
        });
    });
};