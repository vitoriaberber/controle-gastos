const imagem = document.getElementById('imagem');
const botaoSalvar = document.getElementById('salvar');
const inputImagem = document.getElementById('imagem');
const labelImagem = document.querySelector('.btn-imagem');
const botaoReset = document.querySelector('#reset');
const saudacao = document.querySelector('.saudacao');
const menuCabecalho = document.querySelector('.cabecalho__menu');
const navCabecalho = document.querySelector('#navbar')

menuCabecalho.addEventListener('click', () => {
    navCabecalho.classList.toggle('cabecalho-clicado')
});


function lerConteudoDoArquivo(arquivo){
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
            resolve({ url: leitor.result });
        }

        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo`)
        }

        leitor.readAsDataURL(arquivo);
    })
}

const imagemPrincipal = document.querySelector('.imagem-principal');


labelImagem.addEventListener('click', () => {
    inputImagem.addEventListener('change', async (evento) => {
        const arquivo = evento.target.files[0];
        if (arquivo) {
            try {
                const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
                imagemPrincipal.src = conteudoDoArquivo.url;
            } catch (erro){
                console.error('Erro na leitura do arquivo');
            }
        }
    })
})

botaoSalvar.addEventListener('click', (e) => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    e.preventDefault();

    if(nome.trim() === '' || nome.length < 3){
        alert('Nome inválido');
        return
    } else if(senha.trim() === '' || senha.length < 8){
        alert('Insira uma senha válida e com mais ou igual a 8 caracteres')
        return
    } else if(!email.includes('@')){
        alert('Email inválido');
        return
    }

    saudacao.textContent = `Seja bem-vindo(a) ${nome}`;

    localStorage.setItem('perfil', JSON.stringify({
        nome,
        email,
        senha,
        imagem: imagemPrincipal.src
    }));
})

botaoReset.addEventListener('click', (e) => {
    imagemPrincipal.src = '../img/icon-perfil.png';
    saudacao.textContent = '';
    localStorage.removeItem('perfil');
})

window.addEventListener('DOMContentLoaded', () => {
    const dadosSalvos = localStorage.getItem('perfil');
    if (dadosSalvos) {
        const { nome, email, senha, imagem } = JSON.parse(dadosSalvos);

        document.getElementById('nome').value = nome;
        document.getElementById('email').value = email;
        document.getElementById('senha').value = senha;
        imagemPrincipal.src = imagem;
        saudacao.textContent = `Seja bem-vindo(a) ${nome}`;
    }
});
