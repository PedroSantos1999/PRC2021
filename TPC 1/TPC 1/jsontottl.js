var ontology = require('./dataset.json');

var fs = require('fs')

var file = beginFile();

function beginFile() {
    file = '';
    file += '@prefix : <http://www.di.uminho.pt/prc2021/tpc1#> .\n'
    file += '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n'
    file += '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n'
    file += '@prefix xml: <http://www.w3.org/XML/1998/namespace> .\n'
    file += '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n'
    file += '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n'
    file += '@base <http://www.di.uminho.pt/prc2021/tpc1> .\n\n'
    file += '<http://www.di.uminho.pt/prc2021/tpc1> rdf:type owl:Ontology .\n\n'
    file += '#################################################################\n#    Object Properties\n#################################################################\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#eAlunoDe\n'
    file += ':eAlunoDe rdf:type owl:ObjectProperty ;\n'
    file += '          owl:inverseOf :eProfessorDe .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#eEnsinadaPor\n'
    file += ':eEnsinadaPor rdf:type owl:ObjectProperty ;\n'
    file += '              owl:inverseOf :ensina .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#eProfessorDe\n'
    file += ':eProfessorDe rdf:type owl:ObjectProperty ;\n'
    file += '              owl:propertyChainAxiom ( :ensina\n'
    file += '                                     ) .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#ensina\n'
    file += ':ensina rdf:type owl:ObjectProperty ;\n'
    file += '        rdfs:domain :professores ;\n'
    file += '        rdfs:range :unidadesCurriculares .\n\n\n'
    file += '#################################################################\n#    Data properties\n#################################################################\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#anoLetivo\n'
    file += ':anoLetivo rdf:type owl:DatatypeProperty .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#designacao\n'
    file += ':designacao rdf:type owl:DatatypeProperty .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#nome\n'
    file += ':nome rdf:type owl:DatatypeProperty .\n\n\n'
    file += '#################################################################\n#    Classes\n#################################################################\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#alunos\n'
    file += ':alunos rdf:type owl:Class ;\n'
    file += '       rdfs:subClassOf [ rdf:type owl:Restriction ;\n'
    file += '                         owl:someValuesFrom :unidadesCurriculares\n'
    file += '                       ] .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#professores\n'
    file += ':professores rdf:type owl:Class ;\n'
    file += '           rdfs:subClassOf [ rdf:type owl:Restriction ;\n'
    file += '                             owl:onProperty :ensina ;\n'
    file += '                             owl:someValuesFrom :unidadesCurriculares\n'
    file += '                           ] .\n\n\n'
    file += '###  http://www.di.uminho.pt/prc2021/tpc1#unidadesCurriculares\n'
    file += ':unidadesCurriculares rdf:type owl:Class .\n\n\n'
    file += '#################################################################\n#    Individuals\n#################################################################\n'

    ontology["unidadesCurriculares"].forEach((uc) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/tpc1#' + uc.sigla +  '\n'
        file += ':' + uc.sigla + ' rdf:type owl:NamedIndividual ,\n'
        file += '                  :unidadesCurriculares ;\n'
        file += '         :anoLetivo "' + uc.anoLetivo + '" ;\n'
        file += '         :designacao "' + uc.designacao + '" .\n\n'
    });

    ontology["professores"].forEach((p) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/tpc1#' + p.sigla +  '\n'
        file += ':' + p.sigla + ' rdf:type owl:NamedIndividual ,\n'
        file += '              :professores ;\n'
        file += '     :ensina :' + p.ensina + ' ;\n'
        file += '     :nome "' + p.nome + '" .\n\n'
    });

    ontology["alunos"].forEach((a) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/tpc1#' + a.id +  '\n'
        file += ':' + a.id + ' rdf:type owl:NamedIndividual ,\n'
        file += '        :nome "' + a.nome + '" .\n\n'
    });

    file += '\n###  Generated by the OWL API (version 4.5.9.2019-02-01T07:24:44Z) https://github.com/owlcs/owlapi'

    return file
};

fs.appendFileSync("tpc1.ttl", file, function (err) {
    if (err) console.log(err);
    console.log('O ficheiro foi gravado com sucesso...');
});