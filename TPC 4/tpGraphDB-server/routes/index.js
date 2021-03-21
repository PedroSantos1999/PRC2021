var express = require('express');
var router = express.Router();
var axios = require('axios');

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
    PREFIX tp: <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
`

var getLink = "http://localhost:7200/repositories/tabelaP?query=";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/elements', function(req, res, next) {
  var query = `
  SELECT ?s ?simb ?name ?anumber WHERE {
    ?s rdf:type tp:Element ;
       :symbol ?simb ;
       :name ?name ;
       :atomicNumber ?anumber .
  }
  ORDER BY ASC (?anumber)
  `

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
    elements = dados.data.results.bindings.map(bind => {
        return({
            id: bind.s.value.split('#')[1],
            simb: bind.simb.value,
            name: bind.name.value,
            anumber: bind.anumber.value
        })
    });

    res.render('elements', {elements: elements});

  }).catch(e => {
      res.render('error', {error: e});
  });
});

router.get('/elements/:id', function (req, res, next) {
    e_id = req.params.id
    var query = 'SELECT DISTINCT ?anumber ?aweight ?block ?casregid ?classi ?color ?group ?name ?period ?stastate ?symbol WHERE {  tp:' + e_id +' ?p ?o ; :atomicNumber ?anumber ; :atomicWeight ?aweight ; :block ?block ; :casRegistryID ?casregid ; :classification ?classi ; :color ?color ; :group ?group ; :name ?name ; :period ?period ; :standardState ?stastate ; :symbol ?symbol . }'
    var encoded = encodeURIComponent(prefixes + query);

    axios.get(getLink + encoded).then(dados => {
        element = dados.data.results.bindings.map(bind => {
            return({
                anumber: bind.anumber.value,
                aweight: bind.aweight.value,
                block: bind.block.value.split('#')[1],
                casregid: bind.casregid.value,
                classification: bind.classi.value.split('#')[1],
                color: bind.color.value,
                group: bind.group.value.split('#')[1],
                name: bind.name.value,
                period: bind.period.value.split('#')[1],
                standardstate: bind.stastate.value.split('#')[1],
                symbol: bind.symbol.value
            })
        });
        res.render('element', {
            id: req.params.id,
            element: element
        });

    }).catch(e => {
        res.render('error', {error: e});
    });
});

router.get('/groups', function (req, res, next) {
  var query = `
  SELECT ?s ?name ?number WHERE { 
    ?s rdf:type tp:Group . 
    OPTIONAL{ ?s :name ?name } . 
    OPTIONAL{ ?s :number ?number } . 
  } 
  ORDER BY ASC(?s)
  `

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      groups = dados.data.results.bindings.map(bind => {
          return({
              id: bind.s.value.split('#')[1],
              name: (bind.name) ? bind.name.value : "Name not defined",
              number: (bind.number) ? bind.number.value : "Number not defined"
          })
      });

      res.render('groups', {groups: groups});

  }).catch(e => {
      res.render('error', {error: e});
  });
});

router.get('/groups/:id', function (req, res, next) {
    g_id = req.params.id
    var query = 'SELECT * WHERE { tp:' + g_id + ' ?p ?o . }'

    var encoded = encodeURIComponent(prefixes + query);

    axios.get(getLink + encoded).then(dados => {
        group = dados.data.results.bindings.map(bind => {
            return({
                p: bind.p.value.split('#')[1],
                o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
            })
        });

        var number = "Number not defined"
        var name = "Name not defined"
        group.forEach(g => {
            if (g.p == 'number') {
                number = g.o
            }
            if (g.p == 'name') {
                name = g.o
            }
        });

        res.render('group', {
            number: number,
            name: name,
            group: group
        });

    }).catch(e => {
        res.render('error', {error: e});
    });
});

router.get('/periods', function (req, res, next) {
  var query = `
  SELECT ?s ?number WHERE { 
    ?s rdf:type tp:Period . 
    ?s :number ?number .
  } 
  ORDER BY ASC (?number)
  `

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      periods = dados.data.results.bindings.map(bind => {
          return({
              id: bind.s.value.split('#')[1],
              number: (bind.number) ? bind.number.value : "Number not defined"
          })
      });

      res.render('periods', {periods: periods});

  }).catch(e => {
      res.render('error', {error: e});
  });
});

router.get('/periods/:id', function (req, res, next) {
    p_id = req.params.id
    var query = 'SELECT distinct ?name WHERE { tp:' + p_id + ' ?p ?o . tp:' + p_id + ' :element ?name } ORDER BY ?name'

    var encoded = encodeURIComponent(prefixes + query);

    axios.get(getLink + encoded).then(dados => {
        period = dados.data.results.bindings.map(bind => {
            return({
                element: bind.name.value.split('#')[1]
            })
        });

        res.render('period', {
            id: req.params.id.split('_')[1],
            period: period
        });

    }).catch(e => {
        res.render('error', {error: e});
    });
});


module.exports = router;
