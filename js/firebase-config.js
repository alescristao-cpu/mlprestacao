/* ----------------------------------------------------
   Modern Life Residence - Firebase & Cloud Integration
   ---------------------------------------------------- */

const FIREBASE_CONFIG_KEY = 'MODERN_LIFE_FIREBASE_CONFIG';

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.config = this.loadSavedConfig();
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
      console.log('[FirebaseService] Running in Local Hybrid Mock Mode.');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
        console.log('[FirebaseService] Firebase initialized successfully!');
      }
      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('[FirebaseService] Initialization failed:', e);
      return false;
    }
  }

  // Google Authentication Flow
  async loginWithGoogle() {
    if (this.isInitialized && window.firebase.auth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const res = await firebase.auth().signInWithPopup(provider);
        const gUser = res.user;

        // Check if user already exists in moradores
        let existingUser = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === gUser.email.toLowerCase());
        if (!existingUser) {
          existingUser = window.CondoStore.addMorador({
            nome: gUser.displayName || 'Morador Google',
            email: gUser.email,
            apartamento: 'Pendente',
            bloco: 'A',
            cpf: 'Autenticado via Google',
            telefone: gUser.phoneNumber || '',
            photoURL: gUser.photoURL
          });
        }
        window.CondoStore.setCurrentUser(existingUser);
        return { success: true, user: existingUser };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Interactive Google Auth Simulation for local demo
    const googleAccounts = [
      { nome: 'Alessandro Cristiano da Silva', email: 'condominio.modern.life@gmail.com', role: 'Administrador', status: 'Aprovado', apartamento: '152', bloco: 'A' },
      { nome: 'Mariana Castro', email: 'mariana.castro@gmail.com', role: 'Conselheiro', status: 'Aprovado', apartamento: '84', bloco: 'B' },
      { nome: 'Roberto Almeida', email: 'roberto.almeida@hotmail.com', role: 'Morador', status: 'Aprovado', apartamento: '121', bloco: 'A' }
    ];

    const selected = googleAccounts[0]; // Default to Síndico login via Google
    let localUser = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === selected.email.toLowerCase());
    if (!localUser) {
      localUser = window.CondoStore.addMorador(selected);
    }
    window.CondoStore.setCurrentUser(localUser);
    return { success: true, user: localUser };
  }

  async loginWithEmailPassword(email, password) {
    if (this.isInitialized && window.firebase.auth) {
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
        return { success: false, error: 'Seu cadastro está aguardando aprovação do administrador.' };
      }
      window.CondoStore.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'E-mail ou senha incorretos.' };
  }

  async registerUser(userData) {
    if (this.isInitialized && window.firebase.auth) {
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
    const newMorador = window.CondoStore.addMorador(userData);
    return { success: true, user: newMorador };
  }
}

window.FirebaseService = new FirebaseService();
