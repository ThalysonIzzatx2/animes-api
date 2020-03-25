'use strict';

var cheerio = require('cheerio'),
    request = require('request'),
    settings = require('../settings'),
    reqOptions = require('../req-options');

exports.list_all = function (req, res) {
    var slug = req.params.slug || "";
    var url = settings.base_path + "/busca/?search_query=" + slug + "&tipo=desc";

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
        $('#wrapper .col-lg-3.col-md-4.col-sm-6.col-xs-12').each(function (index, el) {
            arr.push({

                'title': $(this).find('.internalUrl').attr('href').split('/').slice(-1).pop(),
                'slug': $(this).find('.internalUrl').attr('href')

            })
        });

        res.json({
            
            'search': arr
        });
    });
};