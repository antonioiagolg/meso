var app = angular.module("mesoApp", ["ngMaterial", "md.data.table", "ngMdIcons"]);

app.factory('ClassificadorEntidade', function() {
    function ClassificadorEntidade(tipoDadoMin,
                                    tipoDadoMax,
                                    numRegistrosMin, 
                                    numRegistrosMax,
                                    classificacao,
                                    pontosFuncao) {
        this.tipoDadoMax = tipoDadoMax;
        this.tipoDadoMin = tipoDadoMin;
        this.registroMin = numRegistrosMin;
        this.registroMax = numRegistrosMax;
        this.classificacao = classificacao;
        this.pontosFuncao = pontosFuncao;

        this.confereQtdDado = function(valor) {
            if(this.tipoDadoMin != this.tipoDadoMax) {
                return (this.tipoDadoMin <= valor && this.tipoDadoMax >= valor);
            }
            return valor == this.tipoDadoMin;
        }

        this.confereRegistro = function(valor) {
            if(this.registroMin != this.registroMax) {
                return (this.registroMin <= valor && this.registroMax >= valor);
            }
            return valor == this.registroMin;
        }
    }

    ClassificadorEntidade.prototype.pertenceAClassificacao = function(valorQtdDados, valorQtdRegistros) {
        return (this.confereQtdDado(valorQtdDados) && this.confereRegistro(valorQtdRegistros));
    }

    ClassificadorEntidade.prototype.getClassificacao = function() {
        return [this.classificacao, this.pontosFuncao];
    }

    return ClassificadorEntidade;
});

app.service("ConfiguracoesService", ["ClassificadorEntidade", function(ClassificadorEntidade) {
    this.configEntidades = {
        ALI: {
            condicoes: [
                new ClassificadorEntidade(0,19,1,1,"baixo",7),
                new ClassificadorEntidade(20,50,1,1,"baixo",7),
                new ClassificadorEntidade(51,1000,1,1,"medio",10),
                new ClassificadorEntidade(0,19,2,5,"baixo",7),
                new ClassificadorEntidade(20,50,2,5,"medio",10),
                new ClassificadorEntidade(51,1000,2,5,"alto",15),
                new ClassificadorEntidade(0,19,6,20,"medio",10),
                new ClassificadorEntidade(20,50,6,20,"alto",15),
                new ClassificadorEntidade(51,1000,6,20,"alto",15)
            ],
        },
        AIE: {
            condicoes: [
                new ClassificadorEntidade(0,19,1,1,"baixo",5),
                new ClassificadorEntidade(20,50,1,1,"baixo",5),
                new ClassificadorEntidade(51,1000,1,1,"medio",7),
                new ClassificadorEntidade(0,19,2,5,"baixo",5),
                new ClassificadorEntidade(20,50,2,5,"medio",7),
                new ClassificadorEntidade(51,1000,2,5,"alto",10),
                new ClassificadorEntidade(0,19,6,20,"medio",7),
                new ClassificadorEntidade(20,50,6,20,"alto",10),
                new ClassificadorEntidade(51,1000,6,20,"alto",10)
            ],
        },
        EE: {
            condicoes: [
                new ClassificadorEntidade(0,4,0,1,"baixo",3),
                new ClassificadorEntidade(5,15,0,1,"baixo",3),
                new ClassificadorEntidade(16,1000,0,1,"medio",4),
                new ClassificadorEntidade(0,4,2,2,"baixo",3),
                new ClassificadorEntidade(5,15,2,2,"medio",4),
                new ClassificadorEntidade(16,1000,2,2,"alto",6),
                new ClassificadorEntidade(0,4,3,20,"medio",4),
                new ClassificadorEntidade(5,15,3,20,"alto",6),
                new ClassificadorEntidade(16,1000,3,20,"alto",6)
            ],
        },
        SE: {
            condicoes: [
                new ClassificadorEntidade(0,5,0,1,"baixo",4),
                new ClassificadorEntidade(6,19,0,1,"baixo",4),
                new ClassificadorEntidade(20,1000,0,1,"medio",5),
                new ClassificadorEntidade(0,5,2,3,"baixo",4),
                new ClassificadorEntidade(6,19,2,3,"medio",5),
                new ClassificadorEntidade(20,1000,2,3,"alto",7),
                new ClassificadorEntidade(0,5,4,20,"medio",5),
                new ClassificadorEntidade(6,19,4,20,"alto",7),
                new ClassificadorEntidade(20,1000,4,20,"alto",7)
            ],
        },
        CE: {
            condicoes: [
                new ClassificadorEntidade(0,5,0,1,"baixo",3),
                new ClassificadorEntidade(6,19,0,1,"baixo",3),
                new ClassificadorEntidade(20,1000,0,1,"medio",4),
                new ClassificadorEntidade(0,5,2,3,"baixo",3),
                new ClassificadorEntidade(6,19,2,3,"medio",4),
                new ClassificadorEntidade(20,1000,2,3,"alto",6),
                new ClassificadorEntidade(0,5,4,20,"medio",4),
                new ClassificadorEntidade(6,19,4,20,"alto",6),
                new ClassificadorEntidade(20,1000,4,20,"alto",6)
            ],
        },
    };

}]);

app.service("PfService", function() {
    var _qtdPontosFuncao = 0;

    this.setPontosFuncao = function(pontosFuncao) {
        _qtdPontosFuncao = pontosFuncao;
    }

    this.getPontosFuncao = function() {
        return _qtdPontosFuncao;
    }
});

app.controller("requisitosCtrl", ["$scope", "$mdToast", "ConfiguracoesService", "PfService", function($scope, $mdToast, ConfiguracoesService, PfService) {

    var limparRequisitoModel = function() {
        return {
            nomeRequisito: '',
            entidade: $scope.entidades[0],
            condicoes: ConfiguracoesService.configEntidades[$scope.entidades[0]].condicoes,
            qtdDados: 0,
            artr: 0,
            grau: '',
            pontosFuncao: 0
        };
    };

    $scope.entidades      = Object.keys(ConfiguracoesService.configEntidades);
    $scope.requisitos     = JSON.parse(localStorage.getItem("requisitos")) || [];
    $scope.requisitoModel = limparRequisitoModel();

    $scope.somaPF = 0;

    $scope.salvarRequisito = function() {
        var classificacao = obterClassificacao($scope.requisitoModel);

        $scope.requisitos.push({
            nomeRequisito: $scope.requisitoModel.nomeRequisito,
            entidade: $scope.requisitoModel.entidade,
            qtdDados: $scope.requisitoModel.qtdDados,
            artr: $scope.requisitoModel.artr,
            grau: classificacao[0],
            pontosFuncao: classificacao[1],
        });

        $scope.requisitoModel = limparRequisitoModel();

        localStorage.setItem("requisitos", JSON.stringify($scope.requisitos));
    }

    $scope.eventoMudarEntidade = function() {
        $scope.requisitoModel.condicoes = ConfiguracoesService.configEntidades[$scope.requisitoModel.entidade].condicoes;
    }

    $scope.calcularPF = function() {
        $scope.somaPF = 0;
        for(i = 0; i < $scope.requisitos.length; i++) {
            $scope.somaPF += $scope.requisitos[i].pontosFuncao;
        }

        PfService.setPontosFuncao($scope.somaPF);

        $mdToast.show(
            $mdToast.simple()
            .textContent('Total de pontos: ' + $scope.somaPF)
            .position('top right')
            .hideDelay(5000)
        );
    }

    var obterClassificacao = function(requisito) {
        var condicoes = requisito.condicoes;
        for(i = 0; i < condicoes.length; i++) {
            if(condicoes[i].pertenceAClassificacao(requisito.qtdDados, requisito.artr)) {
                return condicoes[i].getClassificacao();
            }
        }

        return ['não encontrado', 0];
    }
}]);

app.controller("FatorAjusteCtrl", ["$scope", "PfService", "$mdToast", function($scope,PfService,$mdToast) {
    $scope.fatorAj = {};
    $scope.somatorioInfluencias = 0;
    $scope.valorFatorAjuste = 0;
    $scope.valorPfReajustado = 0;

    $scope.calcularFatorAjuste = function() {
        for(var key in $scope.fatorAj) {
            if($scope.fatorAj.hasOwnProperty(key)) {
                $scope.somatorioInfluencias += $scope.fatorAj[key];
            }
        }

        $scope.valorFatorAjuste = ($scope.somatorioInfluencias * 0.01) + 0.65;
        $scope.valorPfReajustado = $scope.valorFatorAjuste * PfService.getPontosFuncao();

        $mdToast.show(
            $mdToast.simple()
            .textContent('Pontos reajustados: ' + $scope.valorPfReajustado.toFixed(2))
            .position('top right')
            .hideDelay(5000)
        );

        $scope.limpaVariaveis();
    }

    $scope.limpaVariaveis = function() {
        $scope.somatorioInfluencias = 0;
        $scope.valorFatorAjuste = 0;
        $scope.valorPfReajustado = 0;
    }
}]);