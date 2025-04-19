<?php
// Configurações de e-mail
$destinatario = "kolibrasolutions@gmail.com";
$assunto = "Formulário do site Kolibra Solutions";

// Cabeçalhos para evitar spam
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: site@kolibrasolutions.com.br" . "\r\n";
$headers .= "Reply-To: " . (isset($_POST['email']) ? $_POST['email'] : "site@kolibrasolutions.com.br") . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Função para limpar dados
function limparDados($dados) {
    $dados = trim($dados);
    $dados = stripslashes($dados);
    $dados = htmlspecialchars($dados);
    return $dados;
}

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coletar todos os dados do formulário
    $mensagem = "<html><body>";
    $mensagem .= "<h2>Nova mensagem do site Kolibra Solutions</h2>";
    $mensagem .= "<table style='width: 100%; border-collapse: collapse;'>";
    
    // Adicionar todos os campos do formulário à mensagem
    foreach($_POST as $chave => $valor) {
        // Ignorar campos especiais
        if (substr($chave, 0, 1) == "_") {
            continue;
        }
        
        // Tratar arrays (checkboxes)
        if (is_array($valor)) {
            $valor = implode(", ", $valor);
        }
        
        // Limpar dados
        $chave_limpa = limparDados($chave);
        $valor_limpo = limparDados($valor);
        
        // Formatar nome do campo
        $nome_campo = ucfirst(str_replace("_", " ", $chave_limpa));
        
        // Adicionar linha à tabela
        $mensagem .= "<tr>";
        $mensagem .= "<td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>" . $nome_campo . "</td>";
        $mensagem .= "<td style='padding: 8px; border: 1px solid #ddd;'>" . $valor_limpo . "</td>";
        $mensagem .= "</tr>";
    }
    
    $mensagem .= "</table>";
    
    // Adicionar informações adicionais
    $mensagem .= "<p><strong>Data e hora:</strong> " . date("d/m/Y H:i:s") . "</p>";
    $mensagem .= "<p><strong>IP:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>";
    
    $mensagem .= "</body></html>";
    
    // Personalizar assunto com base no formulário
    if (isset($_POST['_subject'])) {
        $assunto = limparDados($_POST['_subject']);
    }
    
    // Enviar e-mail
    $enviado = mail($destinatario, $assunto, $mensagem, $headers);
    
    // Determinar para onde redirecionar
    $pagina_redirecionamento = "obrigado.html";
    if (isset($_POST['_next'])) {
        $pagina_redirecionamento = $_POST['_next'];
    }
    
    // Redirecionar com base no resultado
    if ($enviado) {
        // Enviar e-mail de confirmação para o usuário se tiver e-mail
        if (isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $email_usuario = $_POST['email'];
            $assunto_confirmacao = "Recebemos sua mensagem - Kolibra Solutions";
            $mensagem_confirmacao = "<html><body>";
            $mensagem_confirmacao .= "<h2>Obrigado por entrar em contato!</h2>";
            $mensagem_confirmacao .= "<p>Recebemos sua mensagem e retornaremos em breve.</p>";
            $mensagem_confirmacao .= "<p>Atenciosamente,<br>Equipe Kolibra Solutions</p>";
            $mensagem_confirmacao .= "</body></html>";
            
            $headers_confirmacao = "MIME-Version: 1.0" . "\r\n";
            $headers_confirmacao .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers_confirmacao .= "From: Kolibra Solutions <site@kolibrasolutions.com.br>" . "\r\n";
            
            mail($email_usuario, $assunto_confirmacao, $mensagem_confirmacao, $headers_confirmacao);
        }
        
        // Redirecionar para página de agradecimento
        header("Location: " . $pagina_redirecionamento);
        exit();
    } else {
        // Se falhar, redirecionar para página de erro
        header("Location: erro.html");
        exit();
    }
}
?>
