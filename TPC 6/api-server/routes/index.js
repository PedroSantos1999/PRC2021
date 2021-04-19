var express = require('express');
var router = express.Router();
var axios = require('axios');

var prefixes = ` 
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xml: <http://www.w3.org/XML/1998/namespace>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <http://www.di.uminho.pt/prc2021/tpc5#>
`

var getLink = "http://epl.di.uminho.pt:8738/api/rdf4j/query/PG42847-TP5?query=";


router.get('/pubs', function (req, res, next) {
  if (!(req.query.type)) {
      var query = `
      SELECT ?s ?title WHERE { 
        ?s rdf:type :Bibliography . 
        OPTIONAL{?s :title ?title}. 
      } 
      ORDER BY (?s) 
      `

      var encoded = encodeURIComponent(prefixes + query);

      axios.get(getLink + encoded).then(dados => {
          pubs = dados.data.results.bindings.map(bind => {
              return({
                  id: bind.s.value.split('#')[1],
                  title: bind.title.value
              })
          });
          res.status(200).jsonp(pubs);
      }).catch(err => {
          res.status(500).jsonp(err);
      });
  } else {
      ptype = req.query.type
      var query = 'SELECT ?s ?title WHERE { ?s rdf:type :' + ptype.charAt(0).toUpperCase() + ptype.slice(1) + ' . OPTIONAL{?s :title ?title}. } ORDER BY (?s)';

      var encoded = encodeURIComponent(prefixes + query);

      axios.get(getLink + encoded).then(dados => {
          pubs = dados.data.results.bindings.map(bind => {
              return({
                  id: bind.s.value.split('#')[1],
                  title: bind.title.value
              })
          });
          res.status(200).jsonp(pubs);
      }).catch(err => {
          res.status(500).jsonp(err);
      });
  }
});

router.get('/pubs/:id', function (req, res, next) {
  pid = req.params.id
  var query = 'SELECT ?p ?o { :' + pid + ' ?p ?o.} ORDER BY (?p)';

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      aux_pub = dados.data.results.bindings.map(bind => {
          return({
              p: bind.p.value.split('#')[1],
              o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
          })
      });

      var pub = []
      var arrayAuthors = []
      var arrayEditors = []
      var flagAuthors = true
      var flagEditors = true
      aux_pub.forEach(p => {
          if (p['p'] != 'type') {
              if (p['p'] != "refersAuthors" && p['p'] != "refersEditors") {
                  var obj = {};
                  obj[p['p']] = p['o'];
                  pub.push(obj);
              } else {
                  if (p['p'] != "refersEditors") {
                      var obj = {};
                      arrayAuthors.push(p['o'])
                      obj[p['p']] = arrayAuthors;
                      if (flagAuthors) {
                          pub.push(obj);
                          flagAuthors = false
                      }
                  } else {
                      var obj = {};
                      arrayEditors.push(p['o'])
                      obj[p['p']] = arrayEditors;
                      if (flagEditors) {
                          pub.push(obj);
                          flagEditors = false
                      }
                  }
              }
          } else {
              if (p['o'] != "Bibliography" && p['o'] != "NamedIndividual") {
                  var obj = {};
                  obj[p['p']] = p['o'];
                  pub.push(obj);
              }
          }
      });
      res.status(200).jsonp(pub);
  }).catch(err => {
      res.status(500).jsonp(err);
  });
});

router.get('/authors', function (req, res, next) {
  var query = `
  SELECT ?s ?name WHERE { 
    ?s rdf:type :Author . 
    OPTIONAL{?s :name ?name}. 
  } 
  ORDER BY (?s)
  `;

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      authors = dados.data.results.bindings.map(bind => {
          return({
              id: bind.s.value.split('#')[1],
              name: bind.name.value
          })
      });
      res.status(200).jsonp(authors);
  }).catch(err => {
      res.status(500).jsonp(err);
  });
});

router.get('/authors/:id', function (req, res, next) {
  aid = req.params.id
  var query = 'SELECT DISTINCT ?pub ?title WHERE { :' + aid + ' :write ?pub . ?pub :title ?title . } ORDER BY (?pub)';

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      authors = dados.data.results.bindings.map(bind => {
          return({
              idpub: bind.pub.value.split('#')[1],
              title: bind.title.value
          })
      });
      res.status(200).jsonp(authors);
  }).catch(err => {
      res.status(500).jsonp(err);
  });
});

module.exports = router;
