# Documentação do Sistema de Estatísticas - Kolibra Solutions

Este documento explica como utilizar o sistema de atualização de estatísticas implementado no site da Kolibra Solutions.

## Visão Geral

O sistema permite atualizar manualmente três estatísticas exibidas na página inicial:
- Número de Projetos Entregues
- Porcentagem de Clientes Satisfeitos
- Avaliação Média

Os valores são armazenados localmente no navegador do administrador e carregados automaticamente quando o site é acessado.

## Como Acessar a Página de Administração

1. Para atualizar as estatísticas, acesse a página de administração através da URL:
   ```
   https://seudominio.com.br/admin-stats.html
   ```
   ou
   ```
   http://seusite.com.br/admin-stats.html
   ```

2. Esta página é acessível apenas digitando o endereço diretamente, não há links visíveis no site para evitar acesso não autorizado.

## Como Atualizar as Estatísticas

1. Na página de administração, você verá um formulário com três campos:
   - **Número de Projetos Entregues**: Digite o número total de projetos concluídos
   - **Porcentagem de Clientes Satisfeitos**: Digite apenas o número (0-100), sem o símbolo %
   - **Avaliação Média**: Digite a nota média das avaliações (0.0 - 5.0)

2. Preencha os campos com os valores atualizados

3. Clique no botão "Atualizar Estatísticas"

4. Uma mensagem de confirmação será exibida e você será redirecionado para a página inicial

5. Verifique se os novos valores estão sendo exibidos corretamente

## Notas Importantes

- Os dados são armazenados no navegador local (localStorage), então as atualizações feitas em um dispositivo não afetarão outros dispositivos
- Para garantir que as estatísticas sejam consistentes em todos os dispositivos, faça as atualizações sempre no mesmo navegador/computador
- Se você limpar os dados do navegador, as estatísticas voltarão aos valores padrão (1 projeto, 100% satisfação, 5.0 avaliação)
- Para uma solução mais robusta com armazenamento em banco de dados, entre em contato para uma atualização do sistema

## Suporte

Se você tiver dúvidas ou precisar de assistência com o sistema de estatísticas, entre em contato através do email de suporte.
