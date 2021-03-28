# TPC 5: API de dados com Ontobud

Para este trabalho de casa foi preciso:
1. Analisar o dataset: jcrpubs.xml;
2. Usar o Protégé para construir a parte estrutural e criar indivíduos;
3. Criar uma stylesheet XSLT para povoar a ontologia;
4. Carregar a ontologia no Ontobud:
   - Criar um repositório com o nome PG42847-TP5;
   - Importar o ficheiro novo-arquivo-inf.ttl;
5. Crair uma API de dados com as funcionalidades de CRUD sobre o modelo criado:
   - **GET** /pubs
   - **GET** /pubs/{id}
   - **GET** /pubs?type={article|book|inbook|inproceedings|masterthesis|misc|phdthesis|proceedings}
   - **GET** /authors
   - **GET** /authors/{id}
