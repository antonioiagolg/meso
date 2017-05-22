var app = angular.module("mesoApp", ["ngMaterial", "md.data.table", "ngMdIcons"]);

app.factory('ClassificadorEntidade', function() {
    var ClassificadorEntidade  = function(tipoDadoMin,
                                            tipoDadoMax,
                                            numRegistrosMin, 
                                            numRegistrosMax,
                                            classificacao) {
        this.tipoDadoMax = tipoDadoMax;
        this.tipoDadoMin = tipoDadoMin;
        this.registroMin = numRegistrosMin;
        this.registroMax = numRegistrosMax;
        this.classificacao = classificacao;

        var confereTipoDado = function(valor) {
            if(this.tipoDadoMin != this.tipoDadoMax) {
                return (this.tipoDadoMin <= valor && this.tipoDadoMax >= valor);
            }
            return valor == this.tipoDadoMin;
        }

        var confereRegistro = function(valor) {
            if(this.registroMin != this.registroMax) {
                return (this.registroMin <= valor && this.registroMax >= valor);
            }
            return valor == this.registroMin;
        }

        ClassificadorEntidade.prototype.pertenceAClassificacao = function(valor) {
            return (confereTipoDado(valor) && confereTipoRegistro(valor));
        }

        ClassificadorEntidade.prototype.getClassificacao = function() {
            return this.classificacao;
        }
    }

    return ClassificadorEntidade;
});

app.service("ConfiguracoesService", ["ClassificadorEntidade", function(ClassificadorEntidade) {
    this.configEntidades = {
        arquivoLogicoInterno: {
            valor: "ALI",
            condicoes: [
                new ClassificadorEntidade(0,19,1,1,"baixo"),
                new ClassificadorEntidade(20,50,1,1,"baixo"),
                new ClassificadorEntidade(51,1000,1,1,"medio"),
                new ClassificadorEntidade(0,19,2,5,"baixo"),
                new ClassificadorEntidade(20,50,2,5,"medio"),
                new ClassificadorEntidade(51,1000,2,5,"alto"),
                new ClassificadorEntidade(0,19,6,20,"medio"),
                new ClassificadorEntidade(20,50,6,20,"alto"),
                new ClassificadorEntidade(20,50,6,20,"alto"),
            ],
        },
        arquivoLogicoExterno: {
            valor: "AIE",
            condicoes: [
                new ClassificadorEntidade(0,19,1,1,"baixo"),
                new ClassificadorEntidade(20,50,1,1,"baixo"),
                new ClassificadorEntidade(51,1000,1,1,"medio"),
                new ClassificadorEntidade(0,19,2,5,"baixo"),
                new ClassificadorEntidade(20,50,2,5,"medio"),
                new ClassificadorEntidade(51,1000,2,5,"alto"),
                new ClassificadorEntidade(0,19,6,20,"medio"),
                new ClassificadorEntidade(20,50,6,20,"alto"),
                new ClassificadorEntidade(20,50,6,20,"alto"),
            ],
        },
    };

}]);

app.controller("requisitosCtrl", ["$scope", "ConfiguracoesService", function($scope, ConfiguracoesService) {
    $scope.entidades        = ConfiguracoesService.configEntidades;
    $scope.entidadeSelected = $scope.entidades[Object.keys($scope.entidades)[0]];
}]);