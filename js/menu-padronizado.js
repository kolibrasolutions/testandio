/* Menu de navegação padronizado para todas as páginas */
const menuHTML = `
<nav class="navbar">
    <div class="container">
        <a href="index.html" class="logo">
            <img src="img/logo-new.png" alt="KOLIBRA SOLUTIONS" style="height: 50px; width: auto; max-width: 100%;">
        </a>
        
        <ul class="nav-menu">
            <li><a href="index.html" id="menu-home">Home</a></li>
            <li><a href="portfolio.html" id="menu-portfolio">Portfólio</a></li>
            <li><a href="blog/index.html" id="menu-blog">Blog</a></li>
            <li><a href="construtor.html" id="menu-construtor" class="btn-nav">Construir Pacote</a></li>
        </ul>
        
        <div class="nav-toggle" id="navToggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</nav>
`;

// Função para inserir o menu padronizado
function inserirMenuPadronizado() {
    // Substitui o menu atual pelo menu padronizado
    const navbarExistente = document.querySelector('.navbar');
    if (navbarExistente) {
        navbarExistente.outerHTML = menuHTML;
    }
    
    // Marca o item de menu ativo com base na página atual
    const paginaAtual = window.location.pathname.split('/').pop();
    
    switch(paginaAtual) {
        case 'index.html':
            document.getElementById('menu-home').classList.add('active');
            break;
        case 'portfolio.html':
            document.getElementById('menu-portfolio').classList.add('active');
            break;
        case 'construtor.html':
            document.getElementById('menu-construtor').classList.add('active');
            break;
        case 'planos.html':
        case 'orcamento.html':
        case 'segmentacao.html':
        case 'diagnostico.html':
        case 'selecao-kit.html':
        case 'kolibra_kit_barbearia.html':
        case 'finalizar-pedido.html':
        case 'formulario-problemas.html':
        case 'quiz.html':
        case 'obrigado.html':
            // Estas páginas não têm item de menu ativo específico ou foram removidas da navegação
            break;
    }
}

// Função para corrigir links quebrados
function corrigirLinks() {
    // Corrigir links para kit-start.html
    const linksKitStart = document.querySelectorAll('a[href="kit-start.html"]');
    linksKitStart.forEach(link => {
        link.href = "selecao-kit.html";
    });
    
    // Corrigir links para os arquivos de quiz antigos
    const linksQuizAntigo = document.querySelectorAll('a[href="kolibra_quiz.html"], a[href="kolibra_quiz_atualizado.html"]');
    linksQuizAntigo.forEach(link => {
        link.href = "quiz.html";
    });
}

// Função para adicionar breadcrumbs
function adicionarBreadcrumbs() {
    const paginaAtual = window.location.pathname.split('/').pop();
    let breadcrumbHTML = '<div class="breadcrumbs"><div class="container"><a href="index.html">Home</a>';
    
    switch(paginaAtual) {
        case 'planos.html':
            breadcrumbHTML += ' > <span>Planos</span>';
            break;
        case 'portfolio.html':
            breadcrumbHTML += ' > <span>Portfólio</span>';
            break;
        case 'orcamento.html':
            breadcrumbHTML += ' > <span>Orçamento</span>';
            break;
        case 'construtor.html':
            breadcrumbHTML += ' > <span>Construtor de Plano</span>';
            break;
        case 'segmentacao.html':
            breadcrumbHTML += ' > <span>Escolha seu caminho</span>';
            break;
        case 'diagnostico.html':
            breadcrumbHTML += ' > <span>Diagnóstico</span>';
            break;
        case 'selecao-kit.html':
            breadcrumbHTML += ' > <a href="segmentacao.html">Escolha seu caminho</a> > <span>Seleção de Kit</span>';
            break;
        case 'kolibra_kit_barbearia.html':
            breadcrumbHTML += ' > <a href="segmentacao.html">Escolha seu caminho</a> > <a href="selecao-kit.html">Seleção de Kit</a> > <span>Kit Barbearia</span>';
            break;
        case 'finalizar-pedido.html':
            breadcrumbHTML += ' > <span>Finalizar Pedido</span>';
            break;
        case 'formulario-problemas.html':
            breadcrumbHTML += ' > <a href="diagnostico.html">Diagnóstico</a> > <span>Formulário de Problemas</span>';
            break;
        case 'quiz.html':
            breadcrumbHTML += ' > <span>Quiz Inicial</span>';
            break;
        case 'obrigado.html':
            breadcrumbHTML += ' > <span>Obrigado</span>';
            break;
    }
    
    breadcrumbHTML += '</div></div>';
    
    // Inserir breadcrumbs após o menu
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.insertAdjacentHTML('afterend', breadcrumbHTML);
    }
}

// Executar as funções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inserirMenuPadronizado();
    corrigirLinks();
    adicionarBreadcrumbs();
});
