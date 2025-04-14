// Função para atualizar formulários para usar PHP
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma página com formulário
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            // Verificar se o formulário usa FormSubmit.co
            if (form.action && form.action.includes('formsubmit.co')) {
                // Atualizar a ação do formulário para usar o script PHP local
                form.action = "php/enviar.php";
                form.method = "POST";
                
                // Manter os campos _next e _subject se existirem
                if (!form.querySelector('input[name="_next"]')) {
                    const nextField = document.createElement('input');
                    nextField.type = 'hidden';
                    nextField.name = '_next';
                    nextField.value = 'obrigado.html';
                    form.appendChild(nextField);
                }
                
                // Adicionar validação de formulário antes do envio
                form.addEventListener('submit', function(e) {
                    // Verificar campos obrigatórios
                    const requiredFields = form.querySelectorAll('[required]');
                    let isValid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            isValid = false;
                            field.classList.add('invalid');
                            
                            // Adicionar estilo para campos inválidos se não existir
                            if (!document.getElementById('validation-styles')) {
                                const style = document.createElement('style');
                                style.id = 'validation-styles';
                                style.textContent = `
                                    .invalid {
                                        border-color: #ff3860 !important;
                                        box-shadow: 0 0 0 2px rgba(255, 56, 96, 0.1) !important;
                                    }
                                `;
                                document.head.appendChild(style);
                            }
                        } else {
                            field.classList.remove('invalid');
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                        alert('Por favor, preencha todos os campos obrigatórios.');
                        return false;
                    }
                });
            }
        });
    }
});
