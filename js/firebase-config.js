/* ----------------------------------------------------
   Modern Life Residence - Google Firebase Integration
   Projeto Google Cloud Oficial: paginapretacao
   ---------------------------------------------------- */

const FIREBASE_CONFIG = {
  projectId: "paginapretacao",
  authDomain: "paginapretacao.firebaseapp.com",
  storageBucket: "paginapretacao.appspot.com"
};

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.db = null;
    this.initFirebase();
  }

  initFirebase() {
    if (typeof firebase !== 'undefined') {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        if (firebase.firestore) {
          this.db = firebase.firestore();
        }
        this.isInitialized = true;
        console.log('✅ Google Firebase (paginapretacao) conectado!');
        return true;
      } catch (e) {
        console.warn('Firebase SDK init:', e);
      }
    }
    return false;
  }

  // Permite autenticação por Gmail para qualquer morador
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

    let user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase().trim() === emailGoogle);

    if (!user) {
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
        const nome = prompt(`Cadastrando nova conta Google (${emailGoogle}).\nDigite o seu Nome Completo:`);
        if (!nome) return { success: false, error: 'Cadastro cancelado.' };

        const apartamento = prompt('Digite o número da sua Unidade / Apartamento (ex: Apt 304):');
        if (!apartamento) return { success: false, error: 'Unidade necessária.' };

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
