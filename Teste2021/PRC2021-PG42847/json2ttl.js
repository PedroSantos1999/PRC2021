var ontology = require('./emd.json');

var fs = require('fs')

var file = beginFile();

function beginFile() {
    file = '';
    ontology.forEach((atleta) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/exercicio1#' + atleta.nome.primeiro + '_' + atleta.nome.último +  '\n'
        file += ':' + atleta.nome.primeiro + '_' + atleta.nome.último + ' rdf:type owl:NamedIndividual ,\n'
        file += '                  :Atleta ;\n'
        file += '         :pertenceClube :' + atleta.clube.replace(" ", "_") + ' ;\n'
        file += '         :temIndex :Index_' + atleta.index + ' ;\n'
        file += '         :temModalidade :' + atleta.modalidade + ' ;\n'
        file += '         :email "' + atleta.email + '" ;\n'
        file += '         :genero "' + atleta.género + '" ;\n'
        file += '         :idade ' + atleta.idade + ' ;\n'
        file += '         :morada "' + atleta.morada + '" .\n\n'
    });

    ontology.forEach((m) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/exercicio1#' + m.modalidade +  '\n'
        file += ':' + m.modalidade + ' rdf:type owl:NamedIndividual ,\n'
        file += '                  :Modalidade .\n\n'
    });

    ontology.forEach((c) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/exercicio1#' + c.clube.replace(" ", "_") +  '\n'
        file += ':' + c.clube.replace(" ", "_") + ' rdf:type owl:NamedIndividual ,\n'
        file += '                  :Clube .\n\n'
    });

    ontology.forEach((emd) => {
        file += '\n###  http://www.di.uminho.pt/prc2021/exercicio1#Index_' + emd.index +  '\n'
        file += ':Index_' + emd.index + ' rdf:type owl:NamedIndividual ,\n'
        file += '                  :EMD ;\n'
        file += '         :dataEMD "' + emd.dataEMD + '" ;\n'
        file += '         :federado "' + emd.federado + '"^^xsd:boolean ;\n'
        file += '         :resultado "' + emd.resultado + '"^^xsd:boolean .\n\n'
    });

    return file
};

fs.appendFileSync("entidades.txt", file, function (err) {
    if (err) console.log(err);
    console.log('O ficheiro foi gravado com sucesso...');
});