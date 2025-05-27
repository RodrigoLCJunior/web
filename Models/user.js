// user.js

export class Progressao {
    constructor({ id, totalMoedasTemporarias, totalCliques, totalInimigosDerrotados, avatarId }) {
      this.id = id;
      this.totalMoedasTemporarias = totalMoedasTemporarias;
      this.totalCliques = totalCliques;
      this.totalInimigosDerrotados = totalInimigosDerrotados;
      this.avatarId = avatarId;
    }
  }
  
  export class Avatar {
    constructor({ id, hp, danoBase, progressao }) {
      this.id = id;
      this.hp = hp;
      this.danoBase = danoBase;
      this.progressao = progressao ? new Progressao(progressao) : null;
    }
  }
  
  export class MoedaPermanente {
    constructor({ id, quantidade }) {
      this.id = id;
      this.quantidade = quantidade;
    }
  }
  
  export class User {
    constructor({ id, nome, email, senha, avatar, moedaPermanente }) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senha = senha;
      this.avatar = avatar ? new Avatar(avatar) : null;
      this.moedaPermanente = moedaPermanente ? new MoedaPermanente(moedaPermanente) : null;
    }
  
    toJson() {
      return {
        id: this.id,
        nome: this.nome,
        email: this.email,
        senha: this.senha,
        avatar: this.avatar ? {
          id: this.avatar.id,
          hp: this.avatar.hp,
          danoBase: this.avatar.danoBase,
          progressao: this.avatar.progressao ? {
            id: this.avatar.progressao.id,
            totalMoedasTemporarias: this.avatar.progressao.totalMoedasTemporarias,
            totalCliques: this.avatar.progressao.totalCliques,
            totalInimigosDerrotados: this.avatar.progressao.totalInimigosDerrotados,
            avatarId: this.avatar.progressao.avatarId,
          } : null,
        } : null,
        moedaPermanente: this.moedaPermanente ? {
          id: this.moedaPermanente.id,
          quantidade: this.moedaPermanente.quantidade,
        } : null,
      };
    }
  }
  