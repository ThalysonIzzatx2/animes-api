'use strict';

var cheerio = require('cheerio'),
  request = require('request'),
  settings = require('../settings'),
  reqOptions = require('../req-options');


exports.quality = function (req, res) {
    var key = req.params.video_key || "";
    var url = settings.base_path + "/stream/" + key.replace("|", "/");
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
    var arr = [];
    var $el = $('.nav.nav-pills .idon');
    
    $el.each(function(index, el){
      
 

      arr.push({


        'number' : $($el).find('li').length
        
        
      });

    });

    res.json({
      'animes': arr.length
    });



  });
};