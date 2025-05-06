const btnEnviar = document.getElementById("enviar");
const btnLimpar = document.getElementById("limpar");
const btnApagar = document.getElementById("apagar");
const btnDespesa = document.getElementById("botao-despesa");
const btnRenda = document.getElementById("botao-renda");
const botaoAparecer = document.getElementById('botoes-vazio');
const formDespesa = document.getElementById("form-despesa");
const formRenda = document.getElementById("form-renda");

let todosValoresDespesa = [];
let todosValoresRendas = [];

const tabelaGastosBody = document.querySelector(".tabela-gastos-body");
const totalGastos = document.querySelector(".totalGastos");
const tbodyRendas = document.querySelector(".tbody-rendas");
const totalRendas = document.querySelector(".totalRendas");
const total = document.querySelector(".total");

const menuCabecalho = document.querySelector('.cabecalho__menu');
const navCabecalho = document.querySelector('#navbar')

menuCabecalho.addEventListener('click', () => {
    navCabecalho.classList.toggle('cabecalho-clicado')
});

window.addEventListener("DOMContentLoaded", () => {
  const saudacao = document.querySelector(".saudacao");
  const dadosSalvos = localStorage.getItem("perfil");

  if (dadosSalvos && saudacao) {
    const { nome } = JSON.parse(dadosSalvos);
    saudacao.textContent = `Seja bem-vindo(a) ${nome}`;
  }

  const dadosDespesas = JSON.parse(localStorage.getItem('dados-despesas')) || {}
  const despesasSalvas = dadosDespesas.despesas || []
  todosValoresDespesa = despesasSalvas;

  despesasSalvas.forEach((despesa) => {
    const novoTr = document.createElement("tr");

    novoTr.innerHTML = `
      <td>${despesa.nomeDespesa}</td>
      <td>${despesa.catDespesa}</td>
      <td>${despesa.dataDespesa}</td>
      <td>${despesa.formaPagamento}</td>
      <td>${despesa.valorDespesa}</td>
    `;

    tabelaGastosBody.appendChild(novoTr);
  });

  const dadosRendas = JSON.parse(localStorage.getItem('dados-rendas')) || {};
  const rendasSalvas = dadosRendas.rendas || [];
  todosValoresRendas = rendasSalvas;

  rendasSalvas.forEach((renda) => {
    const novoTr = document.createElement("tr");

    novoTr.innerHTML = `
      <td>${renda.fonteDeRenda}</td>
      <td>${renda.categoria}</td>
      <td>${renda.dataRenda}</td>
      <td>${renda.valorRenda}</td>
    `;

    tbodyRendas.appendChild(novoTr);
  });

  atualizarTotal(todosValoresDespesa, totalGastos);
  atualizarTotal(todosValoresRendas, totalRendas);
  atualizarSaldo();

  const totalSalvo = localStorage.getItem ? JSON.parse(localStorage.getItem('saldo')) : '0';
  total.textContent = totalSalvo.saldo;
});

function setRequiredStatus(form, status) {
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    if (status) {
      if (input.dataset.wasRequired === "true") {
        input.setAttribute("required", "");
      }
    } else {
      if (input.hasAttribute("required")) {
        input.dataset.wasRequired = "true";
      }
      input.removeAttribute("required");
    }
  });
}

btnDespesa.addEventListener("click", () => {
  formDespesa.classList.toggle("fieldset__despesas-vazio");
  if (!formDespesa.classList.contains("fieldset__despesas-vazio")) {
    formRenda.classList.add("fieldset__renda-vazio");
  }
  setRequiredStatus(formDespesa, true);
  setRequiredStatus(formRenda, false);
  verificarBotoesVisiveis()
});

btnRenda.addEventListener("click", () => {
  formRenda.classList.toggle("fieldset__renda-vazio");
  if (!formRenda.classList.contains("fieldset__despesas-vazio")) {
    formDespesa.classList.add("fieldset__despesas-vazio");
  }
  setRequiredStatus(formDespesa, false);
  setRequiredStatus(formRenda, true);
  verificarBotoesVisiveis()
});

function verificarBotoesVisiveis() {
  // Verifica se ambos os formulários estão vazios
  if (
    formDespesa.classList.contains("fieldset__despesas-vazio") &&
    formRenda.classList.contains("fieldset__renda-vazio")
  ) {
    botaoAparecer.classList.add('fieldset__botoes-vazio'); // Esconde os botões
  } else {
    botaoAparecer.classList.remove('fieldset__botoes-vazio'); // Mostra os botões
  }
}

btnEnviar.addEventListener("click", (e) => {
  e.preventDefault()

  if (!formDespesa.classList.contains("fieldset__despesas-vazio")) {
    const nomeDespesa = document.getElementById("nome").value;
    const catDespesa = document.getElementById("cat").value;
    const valorDespesa = document.getElementById("valor").value;
    const formaPagamento = document.getElementById("pgto").value;
    let dataDespesa = document.getElementById("data").value;
    const [ano, mes, dia] = dataDespesa.split("-");
    dataDespesa = `${dia}/${mes}/${ano}`;

    if(nomeDespesa.trim() == '' || valorDespesa.trim() == '' || dataDespesa == ''){
      alert('Insira dados válidos')
      return
    }

    const novoTrNoTbody = document.createElement("tr");

    const novoTdNomeDespesa = document.createElement("td");
    novoTdNomeDespesa.textContent = nomeDespesa;

    const novoTdCatDespesa = document.createElement("td");
    novoTdCatDespesa.textContent = catDespesa;

    const novoTdValorDespesa = document.createElement("td");
    novoTdValorDespesa.textContent = valorDespesa;

    const novoTdFormaPagamento = document.createElement("td");
    novoTdFormaPagamento.textContent = formaPagamento;

    const novoTdDataDespesa = document.createElement("td");
    novoTdDataDespesa.textContent = dataDespesa;
    novoTrNoTbody.appendChild(novoTdNomeDespesa);
    novoTrNoTbody.appendChild(novoTdCatDespesa);
    novoTrNoTbody.appendChild(novoTdDataDespesa);
    novoTrNoTbody.appendChild(novoTdFormaPagamento);
    novoTrNoTbody.appendChild(novoTdValorDespesa);
    tabelaGastosBody.appendChild(novoTrNoTbody);

    const novaDespesa = {
      nomeDespesa,
      catDespesa,
      valorDespesa: parseFloat(valorDespesa),
      formaPagamento,
      dataDespesa
    };
    todosValoresDespesa.push(novaDespesa);
  }

  if (!formRenda.classList.contains("fieldset__renda-vazio")) {
    const fonteDeRenda = document.getElementById("fonte").value;
    const catRendaFixa = document.getElementById("fixa");
    const catRendaExtra = document.getElementById("extra");
    const valorRenda = document.getElementById("valorRenda").value;
    let dataRenda = document.getElementById("dataRenda").value;
    const [ano, mes, dia] = dataRenda.split("-");
    dataRenda= `${dia}/${mes}/${ano}`;

    if(fonteDeRenda.trim() == '' || valorRenda.trim() == '' || dataRenda == ''){
      alert('Insira dados válidos')
      return
    }

    const trRendas = document.createElement("tr");

    const novoTdFonteRenda = document.createElement("td");
    novoTdFonteRenda.textContent = fonteDeRenda;
    trRendas.appendChild(novoTdFonteRenda);

    if (catRendaFixa.checked || catRendaExtra.checked) {
      const novoTdCategoria = document.createElement("td");
      novoTdCategoria.textContent = catRendaFixa.checked ? "Fixa" : "Extra";
      trRendas.appendChild(novoTdCategoria);

      const novoTdvalorRenda = document.createElement("td");
      novoTdvalorRenda.textContent = valorRenda;

      const novoTdDataRenda = document.createElement("td");
      novoTdDataRenda.textContent = dataRenda;

      trRendas.appendChild(novoTdDataRenda);
      trRendas.appendChild(novoTdvalorRenda);
      tbodyRendas.appendChild(trRendas);

      const novaRenda = {
        fonteDeRenda,
        categoria: catRendaFixa.checked ? "Fixa" : "Extra",
        valorRenda: parseFloat(valorRenda),
        dataRenda
      };
      todosValoresRendas.push(novaRenda);
    } else {
      return;
    }
  }
  atualizarTotal(todosValoresDespesa, totalGastos);
  atualizarTotal(todosValoresRendas, totalRendas);
  atualizarSaldo();

  localStorage.setItem("dados-despesas", JSON.stringify({
    despesas: todosValoresDespesa,
    total: totalGastos.textContent
  }));

  localStorage.setItem("dados-rendas", JSON.stringify({
    rendas: todosValoresRendas,
    total: totalRendas.textContent
  }));

  localStorage.setItem("saldo", JSON.stringify({
    saldo: total.textContent
  }));
});

function atualizarTotal(arrayValores, elementoAlvo) {
  const soma = arrayValores.reduce((total, item) => {
    return total + parseFloat(item.valorDespesa || item.valorRenda);
  }, 0);

  elementoAlvo.textContent = soma.toFixed(2);
}

function atualizarSaldo() {
  const somaDespesas = todosValoresDespesa.reduce(
    (total, item) => total + parseFloat(item.valorDespesa),
    0
  );
  const somaRendas = todosValoresRendas.reduce(
    (total, item) => total + parseFloat(item.valorRenda),
    0
  );
  const saldo = somaRendas - somaDespesas;
  total.textContent = saldo.toFixed(2);
}

btnApagar.addEventListener('click', () => {
  todosValoresDespesa = [];
  todosValoresRendas = [];
  
  tabelaGastosBody.textContent = '';
  totalGastos.textContent = '0';

  tbodyRendas.textContent = '';
  totalRendas.textContent = '0';

  total.textContent = '0';

  localStorage.removeItem('dados-despesas');
  localStorage.removeItem('dados-rendas');
  localStorage.removeItem('saldo');
})