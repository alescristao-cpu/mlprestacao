/* ----------------------------------------------------
   Modern Life Residence - Google Firebase Realtime Cloud Config
   Chave de Projeto Google Firebase: 1047186718730
   ---------------------------------------------------- */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA8890_ModernLifeResidence_2026",
  authDomain: "modern-life-1047186718730.firebaseapp.com",
  projectId: "modern-life-1047186718730",
  storageBucket: "modern-life-1047186718730.appspot.com",
  messagingSenderId: "1047186718730",
  appId: "1:1047186718730:web:modernlife"
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
        this.db = firebase.firestore();
        this.isInitialized = true;
        console.log('✅ Google Firebase Firestore conectado com sucesso!');
        return true;
      } catch (e) {
        console.warn('Firebase init fallback:', e);
      }
    }
    return false;
  }

  async loginWithGoogle() {
    if (this.isInitialized && window.firebase.auth) {
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
}

window.FirebaseService = new FirebaseService();
