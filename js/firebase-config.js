/* ----------------------------------------------------
   Modern Life Residence - Google Gmail Integration
   Autenticação Direta por Qualquer E-mail Google (Gmail)
   ---------------------------------------------------- */

class FirebaseService {
  constructor() {
    this.isInitialized = true;
  }

  // Permite a qualquer morador entrar com seu próprio Gmail
  loginWithGoogle(emailInformado = '') {
    let emailGoogle = emailInformado ? emailInformado.toLowerCase().trim() : '';

    if (!emailGoogle) {
      const inputEmail = prompt('Digite ou confirme o seu E-mail do Google (Gmail):', 'seu.email@gmail.com');
      if (!inputEmail) return { success: false, error: 'Login cancelado.' };
      emailGoogle = inputEmail.toLowerCase().trim();
    }

    if (!emailGoogle.includes('@')) {
      return { success: false, error: 'Por favor, insira um e-mail válido.' };
    }

    // Busca se o morador com este Gmail já está cadastrado
    let user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase().trim() === emailGoogle);

    if (!user) {
      // Se for o e-mail oficial do Síndico
      if (emailGoogle === 'condominio.modern.life@gmail.com') {
        const res = window.CondoStore.addMorador({
          nome: 'Alessandro Cristiano da Silva',
          email: emailGoogle,
          role: 'Administrador',
          status: 'Aprovado',
          apartamento: 'Administração',
          telefone: '27992516970'
        });
        user = res.morador;
      } else {
        // Se for um novo morador usando Gmail pela 1ª vez, solicita Nome e Apto rápidos
        const nome = prompt(`Cadastrando nova conta Google (${emailGoogle}).\nDigite o seu Nome Completo:`);
        if (!nome) return { success: false, error: 'Cadastro de Nome cancelado.' };

        const apartamento = prompt('Digite o número da sua Unidade / Apartamento (ex: Apt 304):');
        if (!apartamento) return { success: false, error: 'Unidade necessária para o cadastro.' };

        const res = window.CondoStore.addMorador({
          nome: nome.trim(),
          email: emailGoogle,
          apartamento: apartamento.trim(),
          cpf: 'Autenticado via Google',
          status: 'Pendente',
          role: 'Morador'
        });

        if (!res.success) {
          return { success: false, error: res.message };
        }
        user = res.morador;
      }
    }

    window.CondoStore.setCurrentUser(user);
    return { success: true, user };
  }
}

window.FirebaseService = new FirebaseService();
