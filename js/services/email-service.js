/* ====================================================
   Modern Life Residence - Multi-Gateway Email Dispatcher
   Envio Resiliente de E-mails com Fallback Automático e Cópia de Contingência
   ==================================================== */
window.EmailService = {
  async sendEmail({ to, subject, data }) {
    if (!to) return { success: false, error: 'Sem destinatário' };

    // 1. Tentar Gateway Primário (FormSubmit via FormData sem preflight CORS)
    try {
      const formData = new FormData();
      formData.append('_subject', subject);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, val]) => {
          formData.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
        });
      }

      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        return { success: true, provider: 'FormSubmit' };
      }
    } catch (err) {
      console.warn('[EmailService] Gateway Primário (FormSubmit) indisponível. Ativando fallback...', err);
    }

    // 2. Tentar Gateway Secundário (Formspree Fallback via FormData)
    try {
      const formData2 = new FormData();
      formData2.append('email', to);
      formData2.append('_subject', subject);
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, val]) => {
          formData2.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
        });
      }

      const response = await fetch(`https://formspree.io/f/xknlqpye`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData2
      });

      if (response.ok) {
        return { success: true, provider: 'Formspree' };
      }
    } catch (err) {
      console.warn('[EmailService] Gateway Secundário (Formspree) indisponível.', err);
    }

    // 3. Fallback de Contingência Direta (Gravado no Cofre Supabase Cloud + Notificação)
    if (window.CondoStore && window.CondoStore.data) {
      if (!window.CondoStore.data.ocorrencias) window.CondoStore.data.ocorrencias = [];
      window.CondoStore.data.ocorrencias.unshift({
        id: 'mail_vault_' + Date.now(),
        morador_nome: data['Nome do Morador'] || 'Sistema Mail Vault',
        morador_email: to,
        apartamento: data['Unidade / Apto'] || 'Notificação',
        categoria: 'EmailVault',
        assunto: subject,
        descricao: JSON.stringify(data),
        status: 'Registrado no Cofre',
        data: new Date().toISOString().split('T')[0]
      });
      window.CondoStore.saveData();
    }

    const mailbody = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    return { 
      success: false, 
      provider: 'VaultFallback',
      mailtoUrl: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailbody)}`
    };
  }
};
