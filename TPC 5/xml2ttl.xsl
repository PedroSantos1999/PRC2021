<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xs:doc scope="stylesheet">
        <xs:desc>   
            <xs:p><xs:b>Author:</xs:b> Pedro Santos</xs:p>        
            <xs:p>Conversão do arquivo de jcrpubs de XML para TTL</xs:p>      
        </xs:desc>
    </xs:doc>
    
    <xsl:template match="/bibliography">
        <xsl:apply-templates select="/bibliography/article"/>
        <xsl:apply-templates select="/bibliography/book"/>
        <xsl:apply-templates select="/bibliography/inbook"/>
        <xsl:apply-templates select="/bibliography/inproceedings"/>
        <xsl:apply-templates select="/bibliography/masterthesis"/>
        <xsl:apply-templates select="/bibliography/misc"/>
        <xsl:apply-templates select="/bibliography/phdthesis"/>
        <xsl:apply-templates select="/bibliography/proceedings"/>
        <xsl:for-each select="*/author">
            ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
            :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                                                   :Author ;
                                          :name "<xsl:value-of select="."/>"^^xsd:string .
        </xsl:for-each>
        <xsl:for-each select="*/editor">
            ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
            :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                                                   :Editor ;
                                          :name "<xsl:value-of select="."/>"^^xsd:string .
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="article">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Article ;
              :refersAuthors  <xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/></xsl:variable><xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">:<xsl:value-of select="@id"/> ,</xsl:for-each>
        <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
        </xsl:for-each>
        <xsl:if test="deliverables">
            <xsl:if test="deliverables/pdf">
               :hasFiles :pdf_<xsl:value-of select="@id"/> ;
            </xsl:if>
        </xsl:if>
        <xsl:if test="doi">
               :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="issn">
               :issn "<xsl:value-of select="issn"/>"^^xsd:string ;
        </xsl:if>
               :journal "<xsl:value-of select="journal"/>"^^xsd:string ;
        <xsl:if test="month">
               :month "<xsl:value-of select="month"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="number">
               :number <xsl:value-of select="number"/> ;
        </xsl:if>
        <xsl:if test="publisher">
               :publisher "<xsl:value-of select="publisher"/>"^^xsd:string ;
        </xsl:if>
               :title "<xsl:value-of select="title"/>"^^xsd:string ;
        <xsl:if test="uri">
               :uri "<xsl:value-of select="uri"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="volume">
               :volume "<xsl:value-of select="volume"/>"^^xsd:string ;
        </xsl:if>
               :year <xsl:value-of select="year"/> .        
        <xsl:if test="deliverables">
            <xsl:if test="deliverables/pdf">
                ### http://www.di.uminho.pt/prc2021/arquivo#pdf_<xsl:value-of select="@id"/>
                :pdf_<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                                   :PDF ;
                          :url "<xsl:value-of select="deliverables/pdf/@url"/>" .
            </xsl:if>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="book">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Book ;
              :refersAuthors  <xsl:choose>
            <xsl:when test="author"><xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">
                             :<xsl:value-of select="@id"/> ,
            </xsl:for-each>
                <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> ;
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable>
                <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
             :address "<xsl:value-of select="address"/>"^^xsd:string ;
        <xsl:if test="isbn">
             :isbn "<xsl:value-of select="isbn"/>"^^xsd:string ;
        </xsl:if>
             :month "<xsl:value-of select="month"/>"^^xsd:string ;
             :publisher "<xsl:value-of select="publisher"/>"^^xsd:string ;
             :title "<xsl:value-of select="title"/>"^^xsd:string ;
             :year <xsl:value-of select="year"/> .
    </xsl:template>
    
    <xsl:template match="inbook">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Inbook ;
              :refersAuthors  <xsl:choose>
            <xsl:when test="editor or editor-ref">
                <xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/></xsl:variable><xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">:<xsl:value-of select="@id"/>,</xsl:for-each>
                <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> , 
                </xsl:for-each>
                <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> , 
                </xsl:for-each>
                <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
                </xsl:for-each>
                <xsl:variable name="countEditors"> <xsl:value-of select="count(editor)"/></xsl:variable><xsl:variable name="countEditorsREF"><xsl:value-of select="count(editor-ref)"/> </xsl:variable>
              :refersEditors
                <xsl:for-each select="editor-ref[position() = 1]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor-ref[position() != 1]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor[position() &lt; $countEditors]">
                             :<xsl:value-of select="@id"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor[position() = $countEditors]">
                             :<xsl:value-of select="@id"/> ;
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/></xsl:variable><xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">:<xsl:value-of select="@id"/>,</xsl:for-each>
                <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> ,
                </xsl:for-each>
                <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
           :chapter "<xsl:value-of select="chapter"/>"^^xsd:string ;
        <xsl:if test="doi">
           :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="isbn">
           :isbn "<xsl:value-of select="isbn"/>"^^xsd:string ;
        </xsl:if>
           :month "<xsl:value-of select="month"/>"^^xsd:string ;
           :pages "<xsl:value-of select="pages"/>"^^xsd:string ;
           :publisher "<xsl:value-of select="publisher"/>"^^xsd:string ;
           :title "<xsl:value-of select="title"/>"^^xsd:string ;
        <xsl:if test="volume">
           :volume "<xsl:value-of select="volume"/>"^^xsd:string ;
        </xsl:if>
           :year <xsl:value-of select="year"/> .
    </xsl:template>
    
    <xsl:template match="inproceedings">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Inproceedings ;
              :refersAuthors <xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/></xsl:variable><xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">:<xsl:value-of select="@id"/> ,
        </xsl:for-each>
        <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
        </xsl:for-each>
        <xsl:if test="editor">
              :refersEditors :<xsl:value-of select="editor/@id"/> ;
        </xsl:if>
        <xsl:if test="deliverables">
            <xsl:if test="deliverables/pdf">
              :hasFiles :pdf_<xsl:value-of select="@id"/> ;
            </xsl:if>
        </xsl:if>
        <xsl:if test="address">
              :address "<xsl:value-of select="address"/>"^^xsd:string ;
        </xsl:if>
              :booktitle "<xsl:value-of select="booktitle"/>"^^xsd:string ;
        <xsl:if test="doi">
              :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="isbn">
              :isbn "<xsl:value-of select="isbn"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="issn">
              :issn "<xsl:value-of select="issn"/>"^^xsd:string ;
        </xsl:if>
        <xsl:if test="month">
              :month "<xsl:value-of select="month"/>"^^xsd:string ;
        </xsl:if>
              :title "<xsl:value-of select="title"/>"^^xsd:string ;
        <xsl:if test="uri">
              :uri "<xsl:value-of select="uri"/>"^^xsd:string ;
        </xsl:if> 
              :year <xsl:value-of select="year"/> .
        
        <xsl:if test="deliverables">
            <xsl:if test="deliverables/pdf">
                ### http://www.di.uminho.pt/prc2021/arquivo#pdf_<xsl:value-of select="@id"/>
                :pdf_<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                                   :PDF ;
                          :url "<xsl:value-of select="deliverables/pdf/@url"/>" .
            </xsl:if>
        </xsl:if>
    </xsl:template>  
    
    <xsl:template match="masterthesis">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Masterthesis ;
              :refersAuthors :<xsl:value-of select="author-ref/@authorid"/> ;
              :month "<xsl:value-of select="month"/>"^^xsd:string ;
              :school "<xsl:value-of select="school"/>"^^xsd:string ;
              :title "<xsl:value-of select="title"/>"^^xsd:string ;
              :year <xsl:value-of select="year"/> .
    </xsl:template>
    
    <xsl:template match="misc">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Misc ;
              :refersAuthors  <xsl:variable name="countAuthors"> <xsl:value-of select="count(author)"/></xsl:variable><xsl:variable name="countAuthorsREF"><xsl:value-of select="count(author-ref)"/> </xsl:variable><xsl:for-each select="author[position() = 1]">:<xsl:value-of select="@id"/> ,</xsl:for-each>
        <xsl:for-each select="author[position() != 1]">
                             :<xsl:value-of select="@id"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() &lt; $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
        </xsl:for-each>
        <xsl:for-each select="author-ref[position() = $countAuthorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
        </xsl:for-each>
        <xsl:if test="doi">
              :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
        </xsl:if>
              :howpublished "<xsl:value-of select="howpublished"/>"^^xsd:string ;
              :title "<xsl:value-of select="title"/>"^^xsd:string ;
              :year <xsl:value-of select="year"/> .
    </xsl:template>   
    
    <xsl:template match="phdthesis">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Phdthesis ;
              :refersAuthors :<xsl:value-of select="author-ref/@authorid"/> ;
              :address "<xsl:value-of select="address"/>"^^xsd:string ;
              :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
              :month "<xsl:value-of select="month"/>"^^xsd:string ;
              :school "<xsl:value-of select="school"/>"^^xsd:string ;
              :title "<xsl:value-of select="title"/>"^^xsd:string ;
              :year <xsl:value-of select="year"/> .
    </xsl:template>   
    
    <xsl:template match="proceedings">
        ###  http://www.di.uminho.pt/prc2021/tpc5#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
                       :Proceedings ;
              :refersEditors  <xsl:choose>
            <xsl:when test="editor ">
                <xsl:variable name="countEditors"> <xsl:value-of select="count(editor)"/></xsl:variable><xsl:variable name="countEditorsREF"><xsl:value-of select="count(editor-ref)"/> </xsl:variable>
                <xsl:for-each select="editor-ref[position() = 1]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor-ref[position() != 1]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor[position() &lt; $countEditors]">
                             :<xsl:value-of select="@id"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor[position() = $countEditors]">
                             :<xsl:value-of select="@id"/> ;
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="countEditorsREF"><xsl:value-of select="count(editor-ref)"/> </xsl:variable>
                <xsl:for-each select="editor-ref[position() &lt; $countEditorsREF]">
                             :<xsl:value-of select="@authorid"/> ,
                </xsl:for-each>
                <xsl:for-each select="editor-ref[position() = $countEditorsREF]">
                             :<xsl:value-of select="@authorid"/> ;
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
            :address "<xsl:value-of select="address"/>"^^xsd:string ;
            :doi "<xsl:value-of select="doi"/>"^^xsd:string ;
        <xsl:if test="isbn">
            :isbn "<xsl:value-of select="isbn"/>"^^xsd:string ;
        </xsl:if>
            :month "<xsl:value-of select="month"/>"^^xsd:string ;
            :title "<xsl:value-of select="title"/>"^^xsd:string ;
            :year <xsl:value-of select="year"/> .
    </xsl:template>    
    
</xsl:stylesheet>