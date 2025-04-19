// Script para atualização manual das estatísticas
document.addEventListener('DOMContentLoaded', function() {
    // Carregar valores salvos do localStorage, se existirem
    const projetosCount = localStorage.getItem('kolibra_projetos') || 1;
    const satisfacaoRate = localStorage.getItem('kolibra_satisfacao') || '100%';
    const avaliacaoMedia = localStorage.getItem('kolibra_avaliacao') || '5.0';
    
    // Atualizar os elementos na página
    document.getElementById('projetos-count').textContent = projetosCount;
    document.getElementById('satisfacao-rate').textContent = satisfacaoRate;
    document.getElementById('avaliacao-media').textContent = avaliacaoMedia;
    
    // Verificar se estamos na página de administração
    if (window.location.pathname.includes('admin-stats.html')) {
        // Configurar os campos do formulário com os valores atuais
        document.getElementById('input-projetos').value = projetosCount;
        document.getElementById('input-satisfacao').value = satisfacaoRate.replace('%', '');
        document.getElementById('input-avaliacao').value = avaliacaoMedia;
        
        // Adicionar evento de envio do formulário
        document.getElementById('stats-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter novos valores
            const novoProjetos = document.getElementById('input-projetos').value;
            const novoSatisfacao = document.getElementById('input-satisfacao').value + '%';
            const novoAvaliacao = document.getElementById('input-avaliacao').value;
            
            // Salvar no localStorage
            localStorage.setItem('kolibra_projetos', novoProjetos);
            localStorage.setItem('kolibra_satisfacao', novoSatisfacao);
            localStorage.setItem('kolibra_avaliacao', novoAvaliacao);
            
            // Mostrar mensagem de sucesso
            alert('Estatísticas atualizadas com sucesso!');
            
            // Redirecionar para a página inicial
            window.location.href = 'index.html';
        });
    }
});
