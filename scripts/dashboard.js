window.addEventListener('DOMContentLoaded', () => {
    const saudacao = document.querySelector('.saudacao');
    const dadosSalvos = localStorage.getItem('perfil');
    
    const menuCabecalho = document.querySelector('.cabecalho__menu');
    const navCabecalho = document.querySelector('#navbar')

    menuCabecalho.addEventListener('click', () => {
        navCabecalho.classList.toggle('cabecalho-clicado')
    });
  
    const data = new Date();
    const dataAtual = document.querySelector('.data');
    const mes = document.querySelector('#mes')
    dataAtual.textContent = data.toLocaleDateString('pt-BR')
    mes.textContent = data.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });

    if (dadosSalvos && saudacao) {
      const { nome } = JSON.parse(dadosSalvos);
      saudacao.textContent = `Seja bem-vindo(a) ${nome}`;
    }

    const saldoTotal = document.querySelector('.saldo');
    const totalSaldo = document.querySelector('.saldo-total');
    const saldoSalvo = localStorage.getItem('saldo');
    if(saldoSalvo){
      const {saldo} = JSON.parse(saldoSalvo);
      saldoTotal.textContent = saldo;
      totalSaldo.textContent = saldo;
    }

    const totalDespesas = document.querySelector('.despesa')
    const despesasTotais = document.querySelector('.total-despesas');
    let despesaSalva = localStorage.getItem('dados-despesas');
    if(despesaSalva){
      const {total} = JSON.parse(despesaSalva);
      totalDespesas.textContent = total;
      despesasTotais.textContent = total;
    }

    const totalRendas = document.querySelector('.renda');
    const totalReceitas = document.querySelector('.total-receitas')
    let rendaSalva = localStorage.getItem('dados-rendas');
    if(rendaSalva){
      const {total} = JSON.parse(rendaSalva);
      totalRendas.textContent = total;
      totalReceitas.textContent = total;
    }

    const statusSaldo = document.querySelector('.status-saldo');
    const principalGasto = document.querySelector('.principal-gasto-um')
    let rendaObj = localStorage.getItem('dados-rendas');
    let despesaObj = localStorage.getItem('dados-despesas');

    if (rendaObj && despesaObj) {
      const rendaSalva = JSON.parse(rendaObj);
      const despesaSalva = JSON.parse(despesaObj);

      statusSaldo.textContent = parseFloat(rendaSalva.total) > parseFloat(despesaSalva.total) ? 'positivo' : 'negativo';

      despesaSalva.despesas.forEach((despesa, index, array) => {
        if (index + 1 < array.length) {
          if (despesa.valorDespesa > array[index + 1].valorDespesa) {
            principalGasto.textContent = `${despesa.catDespesa} (R$${despesa.valorDespesa} reais)`;
          } else {
            principalGasto.textContent = `${array[index + 1].catDespesa} (R$${array[index + 1].valorDespesa} reais)`
          }
        }
      });
    } else{
      
    }

  const rendasSalvas = JSON.parse(rendaObj);
  const despesasSalvas = JSON.parse(despesaObj);
  const ctxBarras = document.getElementById('grafico-barras').getContext('2d');
    new Chart(ctxBarras, {
      type: 'bar',
      data: {
        labels: ['Renda', 'Despesa'],
        datasets: [{
          label: 'Valor',
          data: [parseFloat(rendasSalvas.total), parseFloat(despesasSalvas.total)],
          backgroundColor: ['#7F4FF3', '#b398f1'],
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              generateLabels: function(chart) {
                return [{
                  text: 'Valor',
                  fillStyle: 'transparent', // caixinha sem cor
                  strokeStyle: 'transparent',
                  lineWidth: 0
                }];
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    const despesasPorCategoria = {};
    despesasSalvas.despesas.forEach(despesa => {
        if (despesasPorCategoria[despesa.catDespesa]) {
            despesasPorCategoria[despesa.catDespesa] += parseFloat(despesa.valorDespesa);
        } else {
            despesasPorCategoria[despesa.catDespesa] = parseFloat(despesa.valorDespesa);
        }
    });

    const categoriasPizza = Object.keys(despesasPorCategoria);
    const valoresPizza = Object.values(despesasPorCategoria);
    const coresPizza = ['#7F4FF3', '#b398f1', '#cdb7ff', '#6e38ec']; 

    const ctxPizza = document.getElementById('grafico-pizza').getContext('2d');
    new Chart(ctxPizza, {
        type: 'pie',
        data: {
            labels: categoriasPizza,
            datasets: [{
                data: valoresPizza,
                backgroundColor: coresPizza.slice(0, categoriasPizza.length)
            }]
        }
    });
});