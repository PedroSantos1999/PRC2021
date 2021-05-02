import json

with open('individuos.txt', mode='w', encoding='utf8') as i:
    with open('mapa virtual.json', mode='r', encoding='utf8') as mapa:
        data = json.load(mapa)

        for c in data['cidades']:
            # Dados das Cidades
            i.write('###  http://www.di.uminho.pt/prc2021/mapa_virtual#' + c['id'] + '\n')
            i.write(':' + c['id'] + ' rdf:type owl:NamedIndividual ,\n')
            i.write('              :Cidade ;\n')
            i.write('     :descrição "' + c['descrição'] + '" ;\n')
            i.write('     :distrito "' + c['distrito'] + '" ;\n')
            i.write('     :nome "' + c['nome'] + '" ;\n')
            i.write('     :população ' + c['população'] + ' .\n')
            i.write('\n\n')
            
        for l in data['ligações']:
            # Dados das Ligações 
            i.write('###  http://www.di.uminho.pt/prc2021/mapa_virtual#' + l['id'] + '\n')
            i.write(':' + l['id'] + ' rdf:type owl:NamedIndividual ,\n')
            i.write('             :Ligação ;\n')
            i.write('    :temDestino ' + ':' + l['destino'] + ' ;\n')
            i.write('    :temOrigem ' + ':' + l['origem'] + ' ;\n')
            i.write('    :distância ' + str(l['distância']) + ' .\n')
            i.write('\n\n')