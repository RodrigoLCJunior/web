package com.example.jogo.controller;

import com.example.jogo.model.LoginResponse;
import com.example.jogo.model.Usuarios;
import com.example.jogo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Usuarios loginRequest) {
        LoginResponse response = usuarioService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Usuarios>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody Usuarios usuario) {
        try {
            Usuarios novoUsuario = usuarioService.criarUsuario(usuario);
            return ResponseEntity.ok(novoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> modificarUsuario(@PathVariable UUID id, @RequestBody Usuarios usuarios) {
        Usuarios atualizado = usuarioService.modificarUsuario(id, usuarios);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable UUID id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }


     /*
 ** Task..: 79 - Modal Esqueceu Senha
 ** Data..: 26/05/25
 ** Autor.: Victor Emanoel
 ** Motivo: Classe Esqueceu Senha
 ** Obs...:
 */


    // ===========================================
    // NOVA FUNCIONALIDADE: Recuperação de Senha
    // ===========================================


    /*Endpoint para gerar um token de recuperação de senha
     Exemplo de uso no front: POST /api/usuarios/esqueci-senha?email=exemplo@email.com */
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> gerarTokenRecuperacao(@RequestParam String email) {
        Optional<Usuarios> usuarioOpt = usuarioService.buscarUsuarioPorEmail(email);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Email não encontrado"));
        }

        // Gerar token simples (UUID aleatório)
        String token = UUID.randomUUID().toString();
        usuarioService.salvarTokenRecuperacao(email, token);

        // Aqui você pode enviar o token por e-mail futuramente
        return ResponseEntity.ok(Map.of("token", token, "mensagem", "Token gerado com sucesso"));
    }

    /**
     * Endpoint para redefinir a senha usando um token
     * Exemplo de uso no front: POST /api/usuarios/redefinir-senha com JSON:
     * {
     *   "token": "string-gerada-anteriormente",
     *   "novaSenha": "nova_senha_segura"
     * }
     */
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String novaSenha = request.get("novaSenha");

        if (token == null || novaSenha == null || novaSenha.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token e nova senha são obrigatórios"));
        }

        boolean sucesso = usuarioService.redefinirSenha(token, novaSenha);
        if (!sucesso) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token inválido ou expirado"));
        }

        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso"));
    }
}
