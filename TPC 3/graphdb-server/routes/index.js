var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  axios.get("http://localhost:7200/rest/repositories").then(dados => {
      res.render('index', {repositorios: dados.data});
  }).catch(erro => console.log(erro))
});

router.get('/repositorio/:id', function (req, res, next) {
  var prefixes = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `
  axios.get("http://localhost:7200/rest/repositories/" + req.params.id).then(dados => {
      const info = dados.data;

      axios.get("http://localhost:7200/rest/repositories/" + req.params.id + "/size").then(dados => {
          const size = dados.data;

          var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="

          var query = `SELECT ?s WHERE { ?s rdf:type owl:Class}`

          var encoded = encodeURIComponent(prefixes + query)

          axios.get(getLink + encoded)
              .then(dados => {
                  classes = dados.data.results.bindings.map(bind => {
                      return({
                          prefixo: bind.s.value.split('#')[0],
                          classe: bind.s.value.split('#')[1]
                      })
                  });

                  res.render('repositorio', {
                      info: info,
                      tamanho: size,
                      classes: classes
                  });

          }).catch(e => {
              res.render('error', {error: e});
          });
      }).catch(e => {
          res.render('error', {error: e});
      });
  }).catch(e => {
      res.render('error', {error: e});
  });
});

router.get('/repositorio/:id/classe/:classe', function (req, res, next) {
  var prefixes = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `
  prefixes += "PREFIX adv: <" + req.query.p + "#>";

  var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="

  var query = `SELECT ?s WHERE { ?s rdf:type adv:` + req.params.classe + `}`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded).then(dados => {
      var people = dados.data.results.bindings.map(bind => bind.s.value.split('#')[1])
      res.render('classe', {
          classe: req.params.classe,
          repositorio: req.params.id,
          prefixo: req.query.p,
          individuos: people.sort()
      });
  }).catch(e => {
      res.render('error', {error: e});
  })
});

router.get('/repositorio/:id/classe/:classe/individuo/:individuo', function (req, res, next) {
  var prefixes = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `
  prefixes += "PREFIX adv: <" + req.query.p + "#> ";

  var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="

  var query = `SELECT * WHERE { adv:` + req.params.individuo + ` ?p ?o}`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded).then(dados => {
      var properties = dados.data.results.bindings.map(bind => {
          return {
              p: bind.p.value.split('#')[1],
              o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
          }
      });

      res.render('individuo', {
          individuo: req.params.individuo,
          classe: req.params.classe,
          repositorio: req.params.id,
          prefixo: req.query.p,
          propriedades: properties
      });
  }).catch(e => {
      res.render('error', {error: e});
  })
});

module.exports = router;
