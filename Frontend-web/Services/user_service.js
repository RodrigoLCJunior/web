// user_service.js

import { User } from '../Models/user.js';

export class UserService {
  static baseUrl = "https://mob-backend-2.onrender.com/api/usuarios";
  //static baseUrl = "http://localhost:9090/api/usuarios";


  static async login(email, senha) {
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return { success: false, message: "Email inválido" };
    }
    if (!senha) {
      return { success: false, message: "Senha não pode estar vazia" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = new User(data.user);
        localStorage.setItem('user', JSON.stringify(user.toJson()));
        return { success: true, user };
      } else {
        return { success: false, message: data.message || "Erro ao fazer login" };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, message: "Erro de rede ou servidor indisponível" };
    }
  }

  static async register(nome, email, senha) {
    if (!nome) {
      return { success: false, message: "Nome não pode estar vazio" };
    }
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return { success: false, message: "Email inválido" };
    }
    if (!senha || senha.length < 6) {
      return { success: false, message: "Senha deve ter pelo menos 6 caracteres" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        return { success: true, message: data.message || "Cadastro feito com sucesso" };
      } else {
        return { success: false, message: data.message || "Erro ao fazer cadastro" };
      }
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      return { success: false, message: "Erro de rede ou servidor indisponível" };
    }
  }

  static logout() {
    localStorage.removeItem('user');
  }

  static getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? new User(JSON.parse(userData)) : null;
  }
}
