package com.example.jogo.service;

import com.example.jogo.model.*;
import com.example.jogo.repository.CardsRepository;
import com.example.jogo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AvatarService avatarService;

    @Autowired
    private MoedaPermanenteService moedaPermanenteService;

    @Autowired
    private CardsRepository cardsRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Armazena tokens de recuperação de senha temporariamente
    private final Map<String, String> tokensRecuperacao = new ConcurrentHashMap<>();

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

    public Usuarios buscarUsuarioPorId(UUID id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public List<Usuarios> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuarios criarUsuario(Usuarios usuarioRequest) throws IllegalArgumentException {
        if (usuarioRequest.getNome() == null || usuarioRequest.getNome().trim().isEmpty() ||
                usuarioRequest.getEmail() == null || usuarioRequest.getEmail().trim().isEmpty() ||
                usuarioRequest.getSenha() == null || usuarioRequest.getSenha().trim().isEmpty()) {
            throw new IllegalArgumentException("Campos obrigatórios estão vazios");
        }

        Optional<Usuarios> existingUser = usuarioRepository.findByEmail(usuarioRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email já está em uso");
        }

        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());
        Usuarios usuario = new Usuarios();
        usuario.setNome(usuarioRequest.getNome());
        usuario.setEmail(usuarioRequest.getEmail());
        usuario.setSenha(senhaCriptografada);

        Avatar avatar = new Avatar(30);
        avatar = avatarService.criarAvatar(avatar);
        if (avatar == null) {
            throw new IllegalArgumentException("Falha ao criar avatar");
        }

        MoedaPermanente moedaPermanente = moedaPermanenteService.criarMoedaPermanente();
        if (moedaPermanente == null) {
            throw new IllegalArgumentException("Falha ao criar moeda permanente");
        }

        usuario.setAvatar(avatar);
        usuario.setMoedaPermanente(moedaPermanente);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuarios modificarUsuario(UUID id, Usuarios usuarios) {
        Usuarios usuarioVelho = usuarioRepository.findById(id).orElse(null);
        if (usuarioVelho == null ||
                usuarios.getNome() == null || usuarios.getNome().trim().isEmpty() ||
                usuarios.getEmail() == null || usuarios.getEmail().trim().isEmpty() ||
                usuarios.getSenha() == null || usuarios.getSenha().trim().isEmpty()) {
            throw new IllegalArgumentException("Campos obrigatórios estão vazios");
        }

        usuarioVelho.setNome(usuarios.getNome());
        usuarioVelho.setEmail(usuarios.getEmail());
        usuarioVelho.setSenha(passwordEncoder.encode(usuarios.getSenha()));
        return usuarioRepository.save(usuarioVelho);
    }

    @Transactional
    public Usuarios salvarUsuario(Usuarios usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuarios adicionarCartaAoDeckPorNumero(UUID usuarioId, Long numeroCarta) {
        Usuarios usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }

        Cards carta = cardsRepository.findById(numeroCarta).orElse(null);
        if (carta == null) {
            throw new IllegalArgumentException("Carta com número " + numeroCarta + " não encontrada");
        }

        Avatar avatar = usuario.getAvatar();
        if (avatar == null) {
            throw new IllegalStateException("Avatar do usuário não encontrado");
        }

        if (avatar.getDeck() == null) {
            avatar.setDeck(new ArrayList<>());
        }

        avatar.getDeck().add(carta);

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deletarUsuario(UUID id) {
        usuarioRepository.deleteById(id);
    }


    /*
 ** Task..: 79 - Modal Esqueceu Senha
 ** Data..: 26/05/25
 ** Autor.: Victor Emanoel
 ** Motivo: Gerar Token para Recuperação de senha 
 ** Obs...:
 */

    // ===========================
    // Recuperação de Senha
    // ===========================

    public void salvarTokenRecuperacao(String email, String token) {
        tokensRecuperacao.put(token, email);
    }

    @Transactional
    public boolean redefinirSenha(String token, String novaSenha) {
        String email = tokensRecuperacao.get(token);
        if (email == null) {
            return false;
        }

        Optional<Usuarios> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return false;
        }

        Usuarios usuario = usuarioOptional.get();
        String senhaCriptografada = passwordEncoder.encode(novaSenha);
        usuario.setSenha(senhaCriptografada);
        usuarioRepository.save(usuario);

        tokensRecuperacao.remove(token); // Invalida o token após uso
        return true;
    }
}
