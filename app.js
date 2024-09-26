let transacoes = [];
let salario = 0;
let graficoPizza; // Declare a variável do gráfico aqui

// Função para atualizar os dados do gráfico com base nas transações
function atualizarGraficoPizza() {
    if (!graficoPizza) return; // Verifica se o gráfico foi criado

    const categorias = {
        Transporte: 0,
        Lazer: 0,
        Moradia: 0,
        Outros: 0
    };

    // Calcula a soma das despesas para cada categoria
    transacoes.forEach(transacao => {
        if (transacao.tipo === 'Despesa') {
            if (categorias.hasOwnProperty(transacao.categoria)) {
                categorias[transacao.categoria] += transacao.valor;
            } else {
                categorias.Outros += transacao.valor; // Para categorias não reconhecidas
            }
        }
    });

    // Prepara os dados para o gráfico
    const dadosGrafico = [
        categorias.Transporte,
        categorias.Lazer,
        categorias.Moradia,
        categorias.Outros
    ];

    // Atualiza os dados do gráfico
    graficoPizza.data.datasets[0].data = dadosGrafico;
    graficoPizza.update(); // Atualiza o gráfico
}

// Função para carregar transações e salário do localStorage
function carregarTransacoes() {
    const transacoesSalvas = localStorage.getItem('transacoes');
    if (transacoesSalvas) {
        try {
            transacoes = JSON.parse(transacoesSalvas);
            renderizarTransacoes();
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            transacoes = []; // Reseta para um array vazio em caso de erro
        }
    }

    // Carrega o salário
    const salarioSalvo = localStorage.getItem('salario');
    if (salarioSalvo) {
        salario = parseFloat(salarioSalvo);
        document.getElementById('salario').value = salario.toFixed(2); // Carrega o salário no input
    }

    // Atualiza o gráfico com as transações carregadas
    atualizarGraficoPizza(); // Atualiza o gráfico após carregar as transações
}

// Função para criar gráfico de pizza
function criarGraficoPizza() {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Transporte', 'Lazer', 'Moradia', 'Outros'],
            datasets: [{
                label: 'Despesas por Categoria',
                data: [0, 0, 0, 0], // Valores iniciais
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
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
                },
                title: {
                    display: true,
                    text: 'Gráfico de Despesas'
                }
            }
        }
    });
}

// Inicialização da página
window.onload = function() {
    // Cria o gráfico na inicialização
    graficoPizza = criarGraficoPizza();

    // Carrega transações e salário do localStorage
    carregarTransacoes(); 

    const transacaoForm = document.getElementById('transacao-form');
    transacaoForm.onsubmit = function(event) {
        event.preventDefault();
        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value;
        const novaCategoria = document.getElementById('nova-categoria').value.trim(); // Pega a nova categoria

        const categoriaUsada = novaCategoria.length > 0 ? novaCategoria : categoria; // Usa nova categoria se estiver preenchida

        if (valor > 0) {
            adicionarTransacao(valor, tipo, categoriaUsada);
            transacaoForm.reset();
        } else {
            alert('Por favor, insira um valor válido.');
        }
    };

    const salarioForm = document.getElementById('salario-form');
    salarioForm.onsubmit = function(event) {
        event.preventDefault();
        salario = parseFloat(document.getElementById('salario').value);
        localStorage.setItem('salario', salario); // Salva o salário no localStorage
        document.getElementById('salario').value = salario.toFixed(2); // Mantém o valor no input
        atualizarVisaoGeral(); // Atualiza visão geral ao inserir o salário
    };

    atualizarVisaoGeral(); // Atualiza a visão geral ao carregar a página
};

function renderizarTransacoes() {
    const transacoesLista = document.getElementById('transacoes-lista');
    transacoesLista.innerHTML = ''; // Limpa a lista antes de renderizar

    transacoes.forEach((transacao, index) => {
        const divTransacao = document.createElement('div');
        divTransacao.className = 'transacao';
        divTransacao.innerHTML = `
            <strong>${transacao.tipo}</strong>: R$ ${transacao.valor.toFixed(2)} 
            <em>(${transacao.categoria})</em>
            <button onclick="removerTransacao(${index})">Remover</button> <!-- Botão Remover -->
        `;
        transacoesLista.appendChild(divTransacao);
    });
}

function adicionarTransacao(valor, tipo, categoria) {
    transacoes.push({ valor, tipo, categoria });
    localStorage.setItem('transacoes', JSON.stringify(transacoes)); // Salva as transações no localStorage
    renderizarTransacoes(); // Renderiza as transações
    atualizarVisaoGeral(); // Atualiza a visão geral após adicionar uma transação
    atualizarGraficoPizza(); // Atualiza o gráfico de pizza
}

function removerTransacao(index) {
    transacoes.splice(index, 1); // Remove a transação pelo índice
    localStorage.setItem('transacoes', JSON.stringify(transacoes)); // Salva as transações no localStorage
    renderizarTransacoes(); // Renderiza as transações atualizadas
    atualizarVisaoGeral(); // Atualiza a visão geral após remover uma transação
    atualizarGraficoPizza(); // Atualiza o gráfico de pizza após remover uma transação
}

function atualizarVisaoGeral() {
    const totalReceitaElement = document.getElementById('total-receita');
    const totalDespesaElement = document.getElementById('total-despesa');
    const saldoElement = document.getElementById('saldo');
    const salarioParaCalculoElement = document.getElementById('salario-para-calculo');

    if (!totalReceitaElement || !totalDespesaElement || !saldoElement || !salarioParaCalculoElement) {
        if (!totalReceitaElement) console.error('Elemento totalReceitaElement não encontrado.');
        if (!totalDespesaElement) console.error('Elemento totalDespesaElement não encontrado.');
        if (!saldoElement) console.error('Elemento saldoElement não encontrado.');
        if (!salarioParaCalculoElement) console.error('Elemento salarioParaCalculoElement não encontrado.');

        alert('Erro: Um ou mais elementos da visão geral não foram encontrados. Por favor, recarregue a página.');
        return; // Sai da função se algum elemento não foi encontrado
    }

    // Calcula total de receitas (inclui o salário)
    const totalReceita = transacoes.reduce((acc, transacao) => acc + (transacao.tipo === 'Receita' ? transacao.valor : 0), 0) + salario;

    // Calcula total de despesas
    const totalDespesa = transacoes.reduce((acc, transacao) => acc + (transacao.tipo === 'Despesa' ? transacao.valor : 0), 0);
    
    // Calcula saldo
    const saldo = totalReceita - totalDespesa;

    // Atualiza os elementos da visão geral
    totalReceitaElement.textContent = totalReceita.toFixed(2);
    totalDespesaElement.textContent = totalDespesa.toFixed(2);
    saldoElement.textContent = saldo.toFixed(2);
    salarioParaCalculoElement.textContent = salario.toFixed(2);
}

