package com.example.jogo.service;

import com.example.jogo.model.*;
import com.example.jogo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRecuperacaoSenhaRepository tokenRepository;

    @Autowired
    private AvatarService avatarService;

    @Autowired
    private MoedaPermanenteService moedaPermanenteService;

    @Autowired
    private CardsRepository cardsRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    // Processa login verificando e-mail e senha
    @Transactional
    public LoginResponse login(Usuarios loginRequest) {
        Optional<Usuarios> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return new LoginResponse(false, "email", "Email não encontrado", null);
        }

        Usuarios usuario = usuarioOpt.get();

        if (passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            return new LoginResponse(true, null, null, usuario);
        } else {
            return new LoginResponse(false, "senha", "Senha incorreta", null);
        }
    }

    public Optional<Usuarios> buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuarios> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Cria novo usuário com avatar e moedas
    @Transactional
    public Usuarios criarUsuario(Usuarios usuarioRequest) throws IllegalArgumentException {
        if (usuarioRequest.getNome() == null || usuarioRequest.getEmail() == null || usuarioRequest.getSenha() == null) {
            throw new IllegalArgumentException("Campos obrigatórios estão vazios");
        }

        if (usuarioRepository.findByEmail(usuarioRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já está em uso");
        }

        Usuarios usuario = new Usuarios();
        usuario.setNome(usuarioRequest.getNome());
        usuario.setEmail(usuarioRequest.getEmail());
        usuario.setSenha(passwordEncoder.encode(usuarioRequest.getSenha()));

        usuario.setAvatar(avatarService.criarAvatar(new Avatar(30)));
        usuario.setMoedaPermanente(moedaPermanenteService.criarMoedaPermanente());

        return usuarioRepository.save(usuario);
    }

    // Atualiza informações do usuário
    @Transactional
    public Usuarios modificarUsuario(UUID id, Usuarios usuarios) {
        Usuarios usuario = usuarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setNome(usuarios.getNome());
        usuario.setEmail(usuarios.getEmail());
        usuario.setSenha(passwordEncoder.encode(usuarios.getSenha()));
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deletarUsuario(UUID id) {
        usuarioRepository.deleteById(id);
    }

    // Gera token, salva no banco, e envia por e-mail
    public boolean gerarTokenEEnviarEmail(String email) {
        Optional<Usuarios> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) return false;

        String token = UUID.randomUUID().toString();

        TokenRecuperacaoSenha tokenEntity = new TokenRecuperacaoSenha();
        tokenEntity.setToken(token);
        tokenEntity.setEmail(email);
        tokenEntity.setExpiracao(LocalDateTime.now().plusMinutes(10)); // token expira em 10 minutos
        tokenRepository.save(tokenEntity);

        String link = "https://redefinir_senha.html?token=" + token;
        enviarEmailRecuperacao(email, link);

        return true;
    }

    // Envia o e-mail com o link de redefinição
    public void enviarEmailRecuperacao(String email, String link) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Redefinição de Senha - Rewalker");
        mensagem.setText("Clique para redefinir sua senha: " + link);
        mailSender.send(mensagem);
    }

    // Redefine a senha e remove token do banco
    @Transactional
    public boolean redefinirSenha(String token, String novaSenha) {
        Optional<TokenRecuperacaoSenha> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiracao().isBefore(LocalDateTime.now())) {
            return false;
        }

        String email = tokenOpt.get().getEmail();
        Optional<Usuarios> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) return false;

        Usuarios usuario = usuarioOpt.get();
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        tokenRepository.delete(tokenOpt.get()); // remove o token após uso
        return true;
    }
}
