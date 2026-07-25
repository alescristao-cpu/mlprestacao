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
      console.log('[FirebaseService] Running in Local Hybrid Mock Mode (No external key required).');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
        console.log('[FirebaseService] Firebase initialized successfully with cloud backend!');
      }
      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('[FirebaseService] Initialization failed:', e);
      return false;
    }
  }

  // Cloud auth wrappers (delegates to firebase auth or store fallback)
  async loginWithEmailPassword(email, password) {
    if (this.isInitialized && window.firebase.auth) {
      try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: res.user };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    // Fallback Mock authentication
    const user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status !== 'Aprovado') {
        return { success: false, error: 'Seu cadastro está aguardando aprovação do administrador.' };
      }
      window.CondoStore.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'E-mail ou senha incorretos (ou usuário não cadastrado).' };
  }

  async registerUser(userData) {
    if (this.isInitialized && window.firebase.auth) {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.senha);
        // Save extra metadata to Firestore
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
    // Local Store registration
    const newMorador = window.CondoStore.addMorador(userData);
    return { success: true, user: newMorador };
  }
}

window.FirebaseService = new FirebaseService();
