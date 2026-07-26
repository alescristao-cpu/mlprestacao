/* ----------------------------------------------------
   Modern Life Residence - Firebase & Cloud Integration
   Chave de Projeto Google Firebase: 1047186718730
   ---------------------------------------------------- */

const FIREBASE_CONFIG_KEY = 'MODERN_LIFE_FIREBASE_CONFIG';

const DEFAULT_FIREBASE_CONFIG = {
  messagingSenderId: "1047186718730",
  projectId: "modern-life-residence",
  appId: "1:1047186718730:web:modernlife"
};

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.config = this.loadSavedConfig() || DEFAULT_FIREBASE_CONFIG;
    this.initFirebase();
  }

  loadSavedConfig() {
    try {
      const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveConfig(config) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
      this.config = config;
      this.initFirebase();
      return true;
    } catch (e) {
      console.error('Error saving Firebase config:', e);
      return false;
    }
  }

  initFirebase() {
    if (!this.config || !window.firebase) {
      console.log('[FirebaseService] Chave 1047186718730 registrada.');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
        console.log('[FirebaseService] Firebase configurado com sucesso (Chave: 1047186718730)!');
      }
      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('[FirebaseService] Falha na inicialização do Firebase:', e);
      return false;
    }
  }

  // Autenticação via Conta Google
  async loginWithGoogle() {
    if (this.isInitialized && window.firebase && window.firebase.auth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const res = await firebase.auth().signInWithPopup(provider);
        const gUser = res.user;

        let existingUser = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === gUser.email.toLowerCase());
        if (!existingUser) {
          const resMorador = window.CondoStore.addMorador({
            nome: gUser.displayName || 'Morador Google',
            email: gUser.email,
            apartamento: 'Pendente',
            cpf: 'Autenticado via Google',
            telefone: gUser.phoneNumber || '',
            photoURL: gUser.photoURL
          });
          existingUser = resMorador.morador;
        }

        window.CondoStore.setCurrentUser(existingUser);
        return { success: true, user: existingUser };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Login Padrão pelo Síndico Alessandro quando clicado sem SDK carregado
    const selected = { 
      nome: 'Alessandro Cristiano da Silva', 
      email: 'condominio.modern.life@gmail.com', 
      role: 'Administrador', 
      status: 'Aprovado', 
      apartamento: 'Administração' 
    };

    let localUser = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === selected.email.toLowerCase());
    if (!localUser) {
      const res = window.CondoStore.addMorador(selected);
      localUser = res.morador;
    }
    window.CondoStore.setCurrentUser(localUser);
    return { success: true, user: localUser };
  }

  async loginWithEmailPassword(email, password) {
    if (this.isInitialized && window.firebase && window.firebase.auth) {
      try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: res.user };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    const user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status !== 'Aprovado') {
        return { success: false, error: 'Seu cadastro está aguardando aprovação do Síndico no Painel.' };
      }
      window.CondoStore.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'E-mail não encontrado no cadastro.' };
  }

  async registerUser(userData) {
    if (this.isInitialized && window.firebase && window.firebase.auth) {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.senha);
        await firebase.firestore().collection('moradores').doc(res.user.uid).set({
          ...userData,
          id: res.user.uid,
          status: 'Pendente',
          role: 'Morador',
          dataCadastro: new Date().toISOString()
        });
        return { success: true, user: res.user };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    const result = window.CondoStore.addMorador(userData);
    return result;
  }
}

window.FirebaseService = new FirebaseService();
