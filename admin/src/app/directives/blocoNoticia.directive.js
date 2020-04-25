(function(angular){ 'use strict';
    
    var blocoNoticia = function(){
        
    var _template = `        
            <div class="ibox">
                <div class="ibox-content product-box">
                    <img ng-src={{noticia.UrlImagem}}  width="100%" height="100%"/>
                    <div class="product-desc">
                        <span class="product-price" style="background-color: #1c84c6;">
                            <i class="fa fa-thumbs-up fa-lg"></i> {{noticia.Curtidas}}
                            <i class="fa fa-comments fa-lg"></i> {{noticia.Comentarios}}
                        </span>
                        {{noticia.Data | date:'dd/MM/yyyy'}}
                        <a href="#/unileste/noticia/{{noticia.Id}}" class="product-name"> {{noticia.Titulo}} </a>

                        <div class="small m-t-xs">
                            {{noticia.Resumo}}
                        </div>
                        <div class="m-t text-righ">
                            <a data-ng-href="#/unileste/noticia/{{noticia.Id}}" class="btn btn-xs btn-outline btn-primary"> Ler notícia 
                                <i class="fa fa-long-arrow-right"></i> 
                            </a>
                            <p>
                                <ul class="list-inline">
                                    <li>Tags: </li>
                                    <li data-ng-repeat="tag in noticia.Tags" class="text-info"> #{{tag}}</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div> `;
        
        return {
            restrict: 'E',
            template: _template,
            scope:{
                noticia: '=modelo'
            }
        }
    }
    
    angular.module('sharenews').directive('blocoNoticia', blocoNoticia);
    
})(window.angular);