// Carrinho de Compras para Orçamentos - Bronzella Glow

// Classe para gerenciar o carrinho de compras
class ShoppingCart {
    constructor() {
        this.items = [];
        this.init();
    }

    // Inicializar o carrinho
    init() {
        // Carregar itens do localStorage se existirem
        this.loadFromLocalStorage();
        
        // Atualizar contador de itens
        this.updateCartCount();
        
        // Adicionar eventos
        this.setupEventListeners();
    }

    // Configurar listeners de eventos
    setupEventListeners() {
        // Abrir carrinho
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.openCart());
        }
        
        // Fechar carrinho
        const cartClose = document.querySelector('.cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }
        
        // Fechar carrinho ao clicar no overlay
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        // Continuar comprando
        const btnContinue = document.querySelector('.btn-continue');
        if (btnContinue) {
            btnContinue.addEventListener('click', () => this.closeCart());
        }
        
        // Finalizar orçamento
        const btnCheckout = document.querySelector('.btn-checkout');
        if (btnCheckout) {
            btnCheckout.addEventListener('click', () => this.openQuoteModal());
        }
        
        // Fechar modal de orçamento
        const quoteClose = document.querySelector('.quote-close');
        if (quoteClose) {
            quoteClose.addEventListener('click', () => this.closeQuoteModal());
        }
        
        // Enviar orçamento
        const btnSendQuote = document.querySelector('.btn-send-quote');
        if (btnSendQuote) {
            btnSendQuote.addEventListener('click', () => this.sendQuote());
        }
        
        // Adicionar produtos ao carrinho
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addProductFromCard(productCard);
                }
            });
        });
    }

    // Adicionar produto ao carrinho a partir do card
    addProductFromCard(productCard) {
        const productImage = productCard.querySelector('.product-image img').src;
        const productTitle = productCard.querySelector('.product-info h3').textContent;
        const productQuantityInput = productCard.querySelector('.quantity-selector input');
        const quantity = productQuantityInput ? parseInt(productQuantityInput.value) : 1;
        
        // Verificar se o produto já está no carrinho
        const existingItemIndex = this.items.findIndex(item => item.title === productTitle);
        
        if (existingItemIndex !== -1) {
            // Atualizar quantidade se o produto já estiver no carrinho
            this.items[existingItemIndex].quantity += quantity;
        } else {
            // Adicionar novo produto ao carrinho
            this.items.push({
                image: productImage,
                title: productTitle,
                quantity: quantity
            });
        }
        
        // Salvar no localStorage
        this.saveToLocalStorage();
        
        // Atualizar interface
        this.updateCartCount();
        this.renderCartItems();
        
        // Animar ícone do carrinho
        this.animateCartIcon();
        
        // Mostrar notificação
        this.showNotification(`${productTitle} adicionado ao orçamento!`, 'success');
    }

    // Remover produto do carrinho
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removedItem = this.items[index];
            this.items.splice(index, 1);
            
            // Salvar no localStorage
            this.saveToLocalStorage();
            
            // Atualizar interface
            this.updateCartCount();
            this.renderCartItems();
            
            // Mostrar notificação
            this.showNotification(`${removedItem.title} removido do orçamento.`, 'info');
        }
    }

    // Atualizar quantidade de um item
    updateItemQuantity(index, newQuantity) {
        if (index >= 0 && index < this.items.length && newQuantity > 0) {
            this.items[index].quantity = newQuantity;
            
            // Salvar no localStorage
            this.saveToLocalStorage();
            
            // Atualizar interface
            this.renderCartItems();
        }
    }

    // Abrir carrinho
    openCart() {
        const cartContainer = document.querySelector('.cart-container');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartContainer && cartOverlay) {
            cartContainer.classList.add('active');
            cartOverlay.classList.add('active');
            
            // Renderizar itens do carrinho
            this.renderCartItems();
        }
    }

    // Fechar carrinho
    closeCart() {
        const cartContainer = document.querySelector('.cart-container');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartContainer && cartOverlay) {
            cartContainer.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    // Abrir modal de orçamento
    openQuoteModal() {
        const quoteModal = document.querySelector('.quote-modal');
        
        if (quoteModal) {
            // Renderizar resumo do orçamento
            this.renderQuoteSummary();
            
            quoteModal.classList.add('active');
            this.closeCart();
        }
    }

    // Fechar modal de orçamento
    closeQuoteModal() {
        const quoteModal = document.querySelector('.quote-modal');
        
        if (quoteModal) {
            quoteModal.classList.remove('active');
        }
    }

    // Renderizar itens do carrinho
    renderCartItems() {
        const cartItems = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartTotal = document.querySelector('.cart-total-value');
        
        if (cartItems && cartEmpty && cartTotal) {
            // Limpar conteúdo atual
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                // Mostrar mensagem de carrinho vazio
                cartEmpty.style.display = 'block';
                cartTotal.textContent = '0 itens';
            } else {
                // Esconder mensagem de carrinho vazio
                cartEmpty.style.display = 'none';
                
                // Renderizar cada item
                this.items.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-quantity">
                                <div class="quantity-btn minus" data-index="${index}">-</div>
                                <div class="quantity-value">${item.quantity}</div>
                                <div class="quantity-btn plus" data-index="${index}">+</div>
                            </div>
                            <div class="cart-item-remove" data-index="${index}">
                                <i class="fas fa-trash-alt"></i> Remover
                            </div>
                        </div>
                    `;
                    
                    cartItems.appendChild(cartItem);
                });
                
                // Adicionar eventos aos botões de quantidade e remover
                this.addCartItemEvents();
                
                // Atualizar total
                const totalItems = this.getTotalItems();
                cartTotal.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
            }
        }
    }

    // Adicionar eventos aos itens do carrinho
    addCartItemEvents() {
        // Botões de diminuir quantidade
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (this.items[index].quantity > 1) {
                    this.updateItemQuantity(index, this.items[index].quantity - 1);
                }
            });
        });
        
        // Botões de aumentar quantidade
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.updateItemQuantity(index, this.items[index].quantity + 1);
            });
        });
        
        // Botões de remover
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.cart-item-remove').getAttribute('data-index'));
                this.removeItem(index);
            });
        });
    }

    // Renderizar resumo do orçamento
    renderQuoteSummary() {
        const quoteSummaryItems = document.querySelector('.quote-items');
        const quoteTotalValue = document.querySelector('.quote-total-value');
        
        if (quoteSummaryItems && quoteTotalValue) {
            // Limpar conteúdo atual
            quoteSummaryItems.innerHTML = '';
            
            // Renderizar cada item
            this.items.forEach(item => {
                const quoteItem = document.createElement('div');
                quoteItem.className = 'quote-item';
                quoteItem.innerHTML = `
                    <div>${item.title} x${item.quantity}</div>
                `;
                
                quoteSummaryItems.appendChild(quoteItem);
            });
            
            // Atualizar total
            const totalItems = this.getTotalItems();
            quoteTotalValue.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        }
    }

    // Enviar orçamento via WhatsApp
    sendQuote() {
        const nameInput = document.querySelector('#quote-name');
        const phoneInput = document.querySelector('#quote-phone');
        const emailInput = document.querySelector('#quote-email');
        const messageInput = document.querySelector('#quote-message');
        
        // Validar campos obrigatórios
        if (!nameInput.value.trim()) {
            this.showNotification('Por favor, informe seu nome.', 'error');
            nameInput.focus();
            return;
        }
        
        if (!phoneInput.value.trim()) {
            this.showNotification('Por favor, informe seu telefone.', 'error');
            phoneInput.focus();
            return;
        }
        
        // Construir mensagem de orçamento
        let message = `*Orçamento Bronzella Glow*\n\n`;
        message += `*Cliente:* ${nameInput.value.trim()}\n`;
        message += `*Telefone:* ${phoneInput.value.trim()}\n`;
        
        if (emailInput.value.trim()) {
            message += `*E-mail:* ${emailInput.value.trim()}\n`;
        }
        
        message += `\n*Produtos:*\n`;
        
        this.items.forEach(item => {
            message += `- ${item.title} (${item.quantity} unidades)\n`;
        });
        
        message += `\n*Total:* ${this.getTotalItems()} itens\n\n`;
        
        if (messageInput.value.trim()) {
            message += `*Observações:*\n${messageInput.value.trim()}\n\n`;
        }
        
        // Número do WhatsApp do vendedor (com formatação correta para API)
        const phoneNumber = '5511980370202'; // Número para testes
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Criar URL do WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp em nova janela
        window.open(whatsappUrl, '_blank');
        
        // Fechar modal e limpar carrinho
        this.closeQuoteModal();
        this.clearCart();
        
        // Mostrar notificação
        this.showNotification('Orçamento enviado com sucesso!', 'success');
    }

    // Limpar carrinho
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartCount();
    }

    // Obter total de itens no carrinho
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Atualizar contador de itens no ícone do carrinho
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            
            if (totalItems === 0) {
                cartCount.style.display = 'none';
            } else {
                cartCount.style.display = 'flex';
            }
        }
    }

    // Animar ícone do carrinho
    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartIcon) {
            cartIcon.classList.add('animate');
            
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
        }
    }

    // Salvar carrinho no localStorage
    saveToLocalStorage() {
        localStorage.setItem('bronzellaCart', JSON.stringify(this.items));
    }

    // Carregar carrinho do localStorage
    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('bronzellaCart');
        
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (e) {
                console.error('Erro ao carregar carrinho do localStorage:', e);
                this.items = [];
            }
        }
    }

    // Mostrar notificação
    showNotification(message, type) {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remover notificação após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Inicializar carrinho quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância do carrinho
    window.cart = new ShoppingCart();
    
    // Adicionar eventos aos seletores de quantidade nos produtos
    document.querySelectorAll('.quantity-selector button').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.parentElement.querySelector('input');
            const currentValue = parseInt(input.value);
            
            if (e.target.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            } else if (e.target.classList.contains('plus')) {
                input.value = currentValue + 1;
            }
        });
    });
});
