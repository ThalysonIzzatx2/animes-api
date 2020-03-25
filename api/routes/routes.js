'use strict';

module.exports = function (app) {
  var categories = require('../controllers/categoriesController');
  var animelist = require('../controllers/animelistController');
  var animedetail = require('../controllers/animedetailController');
  var animes = require('../controllers/animesController');
  var episodes = require('../controllers/episodesController');
  var search = require('../controllers/animeSearchController');
  var dublado = require('../controllers/animedetailDubladoController');
  var episodeDublado = require('../controllers/episodioDubladoController');
  var quality  = require('../controllers/animequalityController');

//Animes
app.route('/todos/:page?')
 .get(animelist.list_all);

 //Detail okay
app.route('/anime/:slug')
 .get(animedetail.detail);

//Detail dublados
app.route('/animes-dublado/:slug')
 .get(dublado.detail);

 //anime episode okay
app.route('/anime/:slug/:page?')
 .get(animes.episodes);

//Episodios dublados
app.route('/animes-dublado/:slug/:page?')
.get(episodeDublado.episodes);

//lançamentos okay
app.route('/episodes/:page?/:terms?')
 .get(episodes.list_all);

 //video okay
app.route('/episode/video/:video_key')
 .get(episodes.video);

 //Categories okay
 app.route('/category')
 .get(categories.list_all);

 //Pesquisa okay
 app.route('/pesquisa/:slug')
 .get(search.list_all);
 app.route('/episode/quality/:video_key')
 .get(quality.quality);

};
