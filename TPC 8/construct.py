import json
import urllib.parse
import requests as reqs

prefixes = '''
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX noInferences: <http://www.ontotext.com/explicit>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX : <http://www.semanticweb.org/pedro/ontologies/2021/4/untitled-ontology-31#>
        '''

def createConnection():

    getLink = "http://localhost:7200/repositories/mapa?query="
    postLink = "http://localhost:7200/repositories/mapa/statements?update"

    query = 'CONSTRUCT { ?c1 :temLigacao ?c2 . } WHERE { ?l :origem ?c1. ?l :destino ?c2. } ORDER BY ?c1'

    encoded = urllib.parse.quote(prefixes + query)

    resp = reqs.get(getLink + encoded)

    resp.raise_for_status()

    countLines = 0

    for l in resp.text.split('.\n'):
        line_split = l.split()
        if len(line_split) == 3:
            
            insert = 'INSERT DATA { :' + line_split[0].split('#')[1][:-1] + ' :temLigação' + ' :' + line_split[2].split('#')[1][:-1] + ' . }'
            encodedpost = urllib.parse.quote(prefixes + insert)
            resppost = reqs.post(postLink + encodedpost)
            resppost.raise_for_status()
            countLines += 1

            print('Nº total de linhas: ' + countLines)

def main():
    
    createConnection()


if __name__ == "__main__":
    main()