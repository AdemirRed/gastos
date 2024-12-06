let transacoes = [];
let salario = 0;
let categorias = []; // Nova lista para categorias dinâmicas
let graficoPizza;

// Função para atualizar o gráfico de pizza
function atualizarGraficoPizza() {
    if (!graficoPizza) return;

    const somaPorCategoria = categorias.reduce((acc, categoria) => {
        acc[categoria] = 0;
        return acc;
    }, {});

    transacoes.forEach(transacao => {
        if (transacao.tipo === 'Despesa' && somaPorCategoria[transacao.categoria] !== undefined) {
            somaPorCategoria[transacao.categoria] += transacao.valor;
        }
    });

    const dadosGrafico = categorias.map(categoria => somaPorCategoria[categoria]);

    graficoPizza.data.labels = categorias;
    graficoPizza.data.datasets[0].data = dadosGrafico;
    graficoPizza.update();
}

// Função para carregar dados do localStorage
function carregarDados() {
    const transacoesSalvas = localStorage.getItem('transacoes');
    const categoriasSalvas = localStorage.getItem('categorias');
    const salarioSalvo = localStorage.getItem('salario');

    transacoes = transacoesSalvas ? JSON.parse(transacoesSalvas) : [];
    categorias = categoriasSalvas ? JSON.parse(categoriasSalvas) : ['Transporte', 'Lazer', 'Moradia', 'Outros'];
    salario = salarioSalvo ? parseFloat(salarioSalvo) : 0;

    renderizarTransacoes();
    atualizarVisaoGeral();
    atualizarGraficoPizza();
}

// Função para salvar categorias no localStorage
function salvarCategorias() {
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

// Função para criar gráfico de pizza
function criarGraficoPizza() {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                label: 'Despesas por Categoria',
                data: categorias.map(() => 0),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#fff' }
                },
                title: {
                    display: true,
                    text: 'Gráfico de Despesas',
                    color: '#fff'
                }
            }
        }
    });
}

// Inicialização da página
window.onload = function() {
    graficoPizza = criarGraficoPizza();
    carregarDados();

    const transacaoForm = document.getElementById('transacao-form');
    transacaoForm.onsubmit = function(event) {
        event.preventDefault();

        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value.trim();
        const novaCategoria = document.getElementById('nova-categoria').value.trim();

        const categoriaFinal = novaCategoria || categoria;

        if (novaCategoria && !categorias.includes(novaCategoria)) {
            categorias.push(novaCategoria);
            salvarCategorias();
            atualizarSelectCategorias(); // Atualiza o select dinâmico
        }

        if (valor > 0) {
            adicionarTransacao(valor, tipo, categoriaFinal);
            transacaoForm.reset();
        } else {
            alert('Por favor, insira um valor válido.');
        }
    };

    const salarioForm = document.getElementById('salario-form');
    salarioForm.onsubmit = function(event) {
        event.preventDefault();
        salario = parseFloat(document.getElementById('salario').value);
        localStorage.setItem('salario', salario);
        atualizarVisaoGeral();
    };

    atualizarVisaoGeral();
    atualizarSelectCategorias(); // Preenche o select com as categorias salvas
};

// Atualiza o select de categorias
function atualizarSelectCategorias() {
    const select = document.getElementById('categoria');
    select.innerHTML = categorias.map(categoria => `<option value="${categoria}">${categoria}</option>`).join('');
}

// Outras funções (renderizarTransacoes, adicionarTransacao, removerTransacao, atualizarVisaoGeral) permanecem inalteradas...
