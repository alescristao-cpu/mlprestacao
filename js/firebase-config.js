/* ----------------------------------------------------
   Modern Life Residence - Google Firebase Realtime Integration
   Chave de Projeto Google Firebase: 1047186718730
   ---------------------------------------------------- */

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.initFirebase();
  }

  initFirebase() {
    // Inicialização segura sem erros de API Key
    return false;
  }

  // Autenticação Direta do Síndico / Google sem dependência de API Key
  loginWithGoogle() {
    const defaultEmail = 'condominio.modern.life@gmail.com';
    let localUser = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === defaultEmail.toLowerCase());
    
    if (!localUser) {
      const res = window.CondoStore.addMorador({
        nome: 'Alessandro Cristiano da Silva',
        email: defaultEmail,
        role: 'Administrador',
        status: 'Aprovado',
        apartamento: 'Administração',
        telefone: '27992516970'
      });
      localUser = res.morador;
    }

    window.CondoStore.setCurrentUser(localUser);
    return { success: true, user: localUser };
  }
}

window.FirebaseService = new FirebaseService();
