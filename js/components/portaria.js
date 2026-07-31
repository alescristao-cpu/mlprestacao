/* ====================================================
   Modern Life Residence - Painel de Controle da Portaria & Guarita
   Gestão de Encomendas (Mercado Livre, Amazon, iFood) + Aviso WhatsApp
   Controle de Acesso às Áreas Comuns (Piscina, Academia e Salão de Festas)
   ==================================================== */

window.PortariaComponent = {
  activeTab: 'encomendas', // 'encomendas' ou 'reservas'
  searchTerm: '',

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isAllowed = user && (user.role === 'Portaria' || user.role === 'Administrador');

    if (!isAllowed) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 550px; margin: 2rem auto;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #C62828; display: block; margin-bottom: 0.5rem;">door_front</span>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.3rem; margin-top: 0.5rem;">
            Acesso Restrito à Portaria &amp; Guarita
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.75rem 0 1.25rem 0; line-height: 1.5;">
            Este painel é exclusivo para a equipe de <strong>Portaria</strong> e para o <strong>Síndico Master</strong> realizarem a recepção de encomendas e liberação das áreas comuns.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="width: 100%; justify-content: center; padding: 0.85rem;">
            <span class="material-symbols-outlined">login</span> Entrar como Portaria ou Síndico
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.35rem;">
        
        <!-- Header Banner da Portaria -->
        <div class="card-widget" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 1.35rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.15); color: #94A3B8; font-weight: 700; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> PAINEL OPERACIONAL DA GUARITA
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #F8FAFC;">
                Gestão de Portaria: Encomendas &amp; Controle de Acesso
              </h2>
              <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 2px;">
                Registro rápido de entregas com notificação automática via WhatsApp para o morador.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-primary" style="background: #2563EB; border: none; font-weight: 700; padding: 0.75rem 1.1rem;" onclick="PortariaComponent.openNovaEncomendaModal()">
                <span class="material-symbols-outlined">package_2</span> 📦 Registrar Encomenda
              </button>

              <button class="btn-secondary" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); font-weight: 600;" onclick="PortariaComponent.openNovaReservaModal()">
                <span class="material-symbols-outlined">event</span> ➕ Reserva Presencial
              </button>
            </div>
          </div>
        </div>

        <!-- Seletor de Abas Executivas da Portaria -->
        <div class="card-widget" style="padding: 0.5rem; background: var(--bg-surface); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-secondary ${this.activeTab === 'encomendas' ? 'btn-primary' : ''}" 
                    style="flex: 1; min-width: 200px; justify-content: center; padding: 0.75rem 1rem; font-weight: 700; border-radius: 8px;"
                    onclick="PortariaComponent.setTab('encomendas')">
              <span class="material-symbols-outlined">local_shipping</span> 📦 Encomendas &amp; Pacotes na Guarita
            </button>

            <button class="btn-secondary ${this.activeTab === 'reservas' ? 'btn-primary' : ''}" 
                    style="flex: 1; min-width: 200px; justify-content: center; padding: 0.75rem 1rem; font-weight: 700; border-radius: 8px;"
                    onclick="PortariaComponent.setTab('reservas')">
              <span class="material-symbols-outlined">pool</span> 🔑 Reservas &amp; Áreas de Lazer
            </button>
          </div>
        </div>

        <!-- Conteúdo da Aba Selecionada -->
        <div id="portariaTabContent">
          ${this.activeTab === 'encomendas' ? this.renderEncomendasTab(data) : this.renderReservasTab(data)}
        </div>

      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    App.render();
  },

  // ----------------------------------------------------
  // ABA 1: GESTÃO DE ENCOMENDAS & PACOTES NA GUARITA
  // ----------------------------------------------------
  renderEncomendasTab(data) {
    const encomendas = data.encomendas || [];
    const pendentes = encomendas.filter(e => e.status === 'Aguardando Retirada');
    const entreguesHoje = encomendas.filter(e => e.status === 'Entregue ao Morador');

    const search = (this.searchTerm || '').toLowerCase().trim();
    const filtradas = encomendas.filter(e => {
      if (!search) return true;
      const mNome = (e.moradorNome || '').toLowerCase();
      const mApto = (e.apartamento || '').toLowerCase();
      const emp = (e.empresa || '').toLowerCase();
      const desc = (e.descricao || '').toLowerCase();
      return mNome.includes(search) || mApto.includes(search) || emp.includes(search) || desc.includes(search);
    });

    return `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- KPI Cards das Encomendas -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem;">
          
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #F59E0B; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B;">AGUARDANDO RETIRADA</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">package_2</span>
              </div>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #D97706; margin-top: 0.3rem;">
              ${pendentes.length} <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">pacote(s)</span>
            </div>
            <div style="font-size: 0.75rem; color: #D97706; margin-top: 4px; font-weight: 600;">
              📦 Na Guarita da Portaria
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #10B981; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B;">ENTREGUES AOS MORADORES</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">task_alt</span>
              </div>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #10B981; margin-top: 0.3rem;">
              ${entreguesHoje.length} <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">concluída(s)</span>
            </div>
            <div style="font-size: 0.75rem; color: #059669; margin-top: 4px; font-weight: 600;">
              ✅ Baixa Confirmada
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #2563EB; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B;">TOTAL REGISTRADO</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">inventory_2</span>
              </div>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #2563EB; margin-top: 0.3rem;">
              ${encomendas.length} <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">registro(s)</span>
            </div>
            <div style="font-size: 0.75rem; color: #2563EB; margin-top: 4px; font-weight: 600;">
              🚚 Histórico Geral
            </div>
          </div>

        </div>

        <!-- Barra de Busca e Ações -->
        <div class="card-widget" style="padding: 1rem; background: #FFFFFF;">
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px; position: relative;">
              <span class="material-symbols-outlined" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 1.2rem;">search</span>
              <input type="text" class="form-control" placeholder="Buscar morador, apto ou empresa (Mercado Livre, Amazon)..." 
                     value="${this.searchTerm || ''}" oninput="PortariaComponent.handleSearchInput(event)" style="padding-left: 2.2rem;">
            </div>

            <button class="btn-primary" style="padding: 0.65rem 1.2rem; font-weight: 700; background: #2563EB;" onclick="PortariaComponent.openNovaEncomendaModal()">
              <span class="material-symbols-outlined">add_box</span> Receber Encomenda
            </button>
          </div>
        </div>

        <!-- Lista de Pacotes Registrados -->
        <div class="card-widget">
          <div class="card-header" style="margin-bottom: 1rem;">
            <div class="card-title" style="color: #0F172A; font-weight: 700; font-size: 1.05rem;">
              <span class="material-symbols-outlined" style="color: #2563EB;">local_shipping</span> Encomendas Registradas na Guarita (${filtradas.length})
            </div>
          </div>

          ${filtradas.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 0.5rem;">package</span>
              Nenhuma encomenda localizada no momento.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${filtradas.map(e => this.renderEncomendaCard(e)).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  },

  renderEncomendaCard(e) {
    const isPendente = e.status === 'Aguardando Retirada';
    const telClean = (e.telefone || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, ${e.moradorNome}! 📦\n\nSua encomenda da *${e.empresa}* (${e.descricao || 'Pacote'}) acabou de ser recebida na Portaria do Modern Life Residence por ${e.porteiro || 'nossa equipe'}.\n\nVocê já pode retirar na Guarita! ✨`);
    const waUrl = telClean ? `https://api.whatsapp.com/send?phone=55${telClean}&text=${msg}` : `https://api.whatsapp.com/send?text=${msg}`;

    return `
      <div style="background: ${isPendente ? '#FFFBEB' : '#F8FAFC'}; border: 1px solid ${isPendente ? '#FCD34D' : '#E2E8F0'}; border-left: 5px solid ${isPendente ? '#F59E0B' : '#10B981'}; border-radius: 10px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
        
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: ${isPendente ? '#FEF3C7' : '#DCFCE7'}; color: ${isPendente ? '#D97706' : '#15803D'}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
            <span class="material-symbols-outlined">${isPendente ? 'package_2' : 'task_alt'}</span>
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
              <strong style="color: #0F172A; font-size: 1rem;">${e.moradorNome}</strong>
              <span class="badge" style="background: #0F172A; color: white; font-weight: 700; font-size: 0.75rem;">Apto ${e.apartamento}</span>
              <span class="badge" style="background: #2563EB; color: white; font-weight: 700; font-size: 0.75rem;">${e.empresa}</span>
            </div>

            <div style="font-size: 0.88rem; color: #334155; margin-top: 3px; font-weight: 600;">
              📦 ${e.descricao || 'Pacote'} ${e.codigoRastreio ? `&bull; <code style="font-size: 0.78rem;">Rastreio: ${e.codigoRastreio}</code>` : ''}
            </div>

            <div style="font-size: 0.75rem; color: #64748B; margin-top: 3px;">
              Recebido em: <strong>${e.dataChegada ? e.dataChegada.split('-').reverse().join('/') : ''} às ${e.horaChegada || ''}</strong> &bull; Recebido por: ${e.porteiro || 'Portaria'}
              ${!isPendente && e.retiradoPor ? ` &bull; <span style="color: #059669; font-weight: 700;">Entregue para: ${e.retiradoPor} (${e.dataRetirada || ''})</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
          ${isPendente ? `
            <a href="${waUrl}" target="_blank" class="btn-primary btn-sm" style="background: #25D366; border: none; font-weight: 700; text-decoration: none;" title="Avisar no WhatsApp do morador">
              <span class="material-symbols-outlined" style="font-size: 1rem;">chat</span> Avisar WhatsApp
            </a>

            <button class="btn-primary btn-sm" style="background: #10B981; border: none; font-weight: 700;" onclick="PortariaComponent.confirmarBaixaEncomenda('${e.id}', '${e.moradorNome}')">
              <span class="material-symbols-outlined" style="font-size: 1rem;">check_circle</span> Dar Baixa
            </button>
          ` : `
            <span class="badge badge-success" style="padding: 0.5rem 0.8rem; font-size: 0.8rem; font-weight: 700;">
              ✓ Entregue ao Morador
            </span>
          `}

          <button class="btn-secondary btn-sm btn-danger" style="background: white; color: #C62828;" onclick="PortariaComponent.excluirEncomenda('${e.id}')" title="Excluir Registro">
            <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span>
          </button>
        </div>

      </div>
    `;
  },

  handleSearchInput(e) {
    this.searchTerm = e.target.value;
    App.render();
  },

  openNovaEncomendaModal() {
    const existing = document.getElementById('modalNovaEncomenda');
    if (existing) existing.remove();

    const moradores = (window.CondoStore.data.moradores || []).filter(m => m && m.status === 'Aprovado' && m.email !== 'condominio.modern.life@gmail.com');

    const modalHtml = `
      <div class="modal-overlay active" id="modalNovaEncomenda" style="z-index: 99999;">
        <div class="modal-card" style="max-width: 540px; border: 2px solid #2563EB;">
          <div class="modal-header" style="background: #2563EB; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              📦 Registrar Chegada de Nova Encomenda / Pacote
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalNovaEncomenda').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="PortariaComponent.submeterNovaEncomenda(event)">
              
              <div class="form-group">
                <label class="form-label">Selecione o Morador / Apto Destinatário</label>
                <select id="encMoradorId" class="form-control" style="font-weight: 700;" required>
                  <option value="">-- Clique para escolher o morador --</option>
                  ${moradores.map(m => `
                    <option value="${m.id}" data-nome="${m.nome}" data-apto="${m.apartamento}" data-tel="${m.telefone || ''}">
                      🏡 Apto ${m.apartamento} - ${m.nome} (${m.email})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Empresa / Transportadora</label>
                  <select id="encEmpresa" class="form-control" style="font-weight: 700;" required>
                    <option value="Mercado Livre">📦 Mercado Livre</option>
                    <option value="Amazon">🚚 Amazon</option>
                    <option value="Shopee">🛒 Shopee</option>
                    <option value="Magalu">🏬 Magalu / Magazine Luiza</option>
                    <option value="iFood">🍔 iFood / Alimentos</option>
                    <option value="Correios">📮 Correios (Sedex / PAC)</option>
                    <option value="Jadlog">🚛 Jadlog / Loggi</option>
                    <option value="Outros">📋 Outras Transportadoras</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Porteiro Responsável</label>
                  <input type="text" id="encPorteiro" class="form-control" value="Portaria & Guarita" required style="font-weight: 600;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Descrição do Pacote / Volume</label>
                <input type="text" id="encDescricao" class="form-control" placeholder="Ex: Caixa P, Pacote de Roupa, Sacola iFood" required style="font-weight: 600;">
              </div>

              <div class="form-group">
                <label class="form-label">Código de Rastreio / Etiqueta (Opcional)</label>
                <input type="text" id="encRastreio" class="form-control" placeholder="Ex: MLB98240192">
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalNovaEncomenda').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="background: #2563EB; padding: 0.85rem 1.4rem; font-weight: 700;">
                  <span class="material-symbols-outlined">save</span> Registrar &amp; Gerar Aviso WhatsApp
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterNovaEncomenda(e) {
    e.preventDefault();
    const select = document.getElementById('encMoradorId');
    const selectedOption = select.options[select.selectedIndex];

    if (!select.value) {
      alert('Por favor, selecione um morador destinatário.');
      return;
    }

    const moradorId = select.value;
    const moradorNome = selectedOption.getAttribute('data-nome') || 'Morador';
    const apartamento = selectedOption.getAttribute('data-apto') || '';
    const telefone = selectedOption.getAttribute('data-tel') || '';

    const empresa = document.getElementById('encEmpresa').value;
    const porteiro = document.getElementById('encPorteiro').value.trim();
    const descricao = document.getElementById('encDescricao').value.trim();
    const codigoRastreio = document.getElementById('encRastreio').value.trim();

    const newPkg = window.CondoStore.addEncomenda({
      moradorId,
      moradorNome,
      apartamento,
      telefone,
      empresa,
      porteiro,
      descricao,
      codigoRastreio
    });

    document.getElementById('modalNovaEncomenda').remove();
    App.showToast(`📦 Encomenda da ${empresa} registrada para ${moradorNome} (Apto ${apartamento})!`, 'success');
    App.render();

    // Abrir Modal de Aviso Instantâneo via WhatsApp
    this.openSucessoWhatsAppModal(newPkg);
  },

  openSucessoWhatsAppModal(pkg) {
    const existing = document.getElementById('modalWhatsappAviso');
    if (existing) existing.remove();

    const telClean = (pkg.telefone || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, ${pkg.moradorNome}! 📦\n\nSua encomenda da *${pkg.empresa}* (${pkg.descricao}) acabou de ser recebida na Portaria do Modern Life Residence por ${pkg.porteiro}.\n\nVocê já pode retirar na Guarita! ✨`);
    const waUrl = telClean ? `https://api.whatsapp.com/send?phone=55${telClean}&text=${msg}` : `https://api.whatsapp.com/send?text=${msg}`;

    const modalHtml = `
      <div class="modal-overlay active" id="modalWhatsappAviso" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 500px; border: 2px solid #25D366;">
          <div class="modal-header" style="background: #25D366; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">
              💬 Enviar Notificação no WhatsApp do Morador
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalWhatsappAviso').remove()">✕</button>
          </div>
          <div class="modal-body" style="text-align: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #DCFCE7; color: #15803D; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1rem auto;">
              <span class="material-symbols-outlined">chat</span>
            </div>

            <h3 style="font-size: 1.1rem; color: #0F172A; font-weight: 700;">Enviar mensagem para ${pkg.moradorNome} (Apto ${pkg.apartamento})?</h3>
            <p style="font-size: 0.88rem; color: #475569; margin-top: 0.4rem; line-height: 1.5;">
              Clique no botão abaixo para abrir o WhatsApp com a mensagem formatada de chegada da encomenda.
            </p>

            <div style="margin: 1.25rem 0; display: flex; gap: 0.5rem; justify-content: center;">
              <a href="${waUrl}" target="_blank" class="btn-primary" style="background: #25D366; border: none; font-weight: 700; padding: 0.85rem 1.5rem; text-decoration: none; font-size: 1rem;" onclick="document.getElementById('modalWhatsappAviso').remove()">
                <span class="material-symbols-outlined">send</span> Abrir WhatsApp Agora
              </a>
              <button type="button" class="btn-secondary" onclick="document.getElementById('modalWhatsappAviso').remove()">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  confirmarBaixaEncomenda(id, moradorNome) {
    const retiradoPor = prompt(`Confirmar baixa de entrega para "${moradorNome}".\n\nQuem está retirando o pacote na Guarita?`, 'Próprio Morador');
    if (retiradoPor === null) return;

    const rFinal = retiradoPor.trim() || 'Próprio Morador';
    window.CondoStore.baixarEncomenda(id, rFinal);

    App.showToast(`✅ Baixa confirmada! Pacote entregue para: ${rFinal}`, 'success');
    App.render();
  },

  excluirEncomenda(id) {
    if (!confirm('Deseja excluir permanentemente este registro de encomenda?')) return;

    window.CondoStore.deleteEncomenda(id);
    App.showToast('Registro de encomenda excluído.', 'info');
    App.render();
  },

  // ----------------------------------------------------
  // ABA 2: RESERVAS & ÁREAS COMUNS (PISCINA, ACADEMIA, SALÃO)
  // ----------------------------------------------------
  renderReservasTab(data) {
    const hojeStr = new Date().toISOString().split('T')[0];
    const limite30Dias = new Date();
    limite30Dias.setDate(limite30Dias.getDate() - 30);
    const limiteStr = limite30Dias.toISOString().split('T')[0];

    const todasReservas = (data.agendaReservas || []).filter(r => r.data >= limiteStr);

    const hojeReservas = todasReservas.filter(r => r.data === hojeStr);
    const futurasReservas = todasReservas.filter(r => r.data > hojeStr);
    const passadasReservas = todasReservas.filter(r => r.data < hojeStr);

    return `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Agendamentos de HOJE -->
        <div class="card-widget" style="border: 2px solid #2E6B42;">
          <div style="background: var(--primary-light); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 700; color: var(--primary-dark); font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="material-symbols-outlined" style="font-size: 1.5rem; color: var(--primary);">today</span>
              Agendamentos para HOJE (${hojeStr.split('-').reverse().join('/')})
            </div>
            <span class="badge badge-success" style="font-size: 0.85rem;">${hojeReservas.length} Reservas Hoje</span>
          </div>

          ${hojeReservas.length === 0 ? `
            <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.4; display: block; margin-bottom: 0.3rem;">event_available</span>
              Nenhum agendamento de área comum registrado para hoje.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${hojeReservas.map(r => this.renderReservaCard(r)).join('')}
            </div>
          `}
        </div>

        <!-- Próximos Agendamentos Futuros -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">event</span> Próximos Agendamentos (${futurasReservas.length})
            </div>
          </div>

          ${futurasReservas.length === 0 ? `
            <p style="color: var(--text-muted); font-size: 0.88rem; text-align: center; padding: 1rem;">Nenhum agendamento futuro registrado.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${futurasReservas.map(r => this.renderReservaCard(r)).join('')}
            </div>
          `}
        </div>

        <!-- Histórico Recente -->
        ${passadasReservas.length > 0 ? `
          <div class="card-widget" style="opacity: 0.9;">
            <div class="card-header">
              <div class="card-title" style="color: var(--text-muted);">
                <span class="material-symbols-outlined">history</span> Histórico de Uso Recente (Últimos 30 Dias)
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${passadasReservas.slice(0, 10).map(r => this.renderReservaCard(r, true)).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  renderReservaCard(r, isHistory = false) {
    const isAutorizado = r.status === 'Autorizado' || r.status === 'Entrada Autorizada' || r.status === 'Uso Concluído';
    const isBloqueado = r.status === 'Acesso Bloqueado' || r.status === 'Cancelado';

    let badgeStyle = 'badge-warning';
    let labelStatus = r.status || 'Confirmado';

    if (isAutorizado) {
      badgeStyle = 'badge-success';
      labelStatus = '✓ Autorizado';
    } else if (isBloqueado) {
      badgeStyle = 'badge-danger';
      labelStatus = '🚫 Acesso Bloqueado';
    }

    return `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.95rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <strong style="color: #0F172A;">${r.moradorNome || 'Morador'}</strong>
            <span class="badge" style="background: #0F172A; color: white;">Apto ${r.apartamento || ''}</span>
            <span class="badge" style="background: #2563EB; color: white;">${r.area || 'Área Comum'}</span>
            <span class="badge ${badgeStyle}">${labelStatus}</span>
          </div>

          <div style="font-size: 0.85rem; color: #475569; margin-top: 4px;">
            📅 Data: <strong>${r.data ? r.data.split('-').reverse().join('/') : ''}</strong> &bull; Horário: <strong>${r.horario || 'Dia todo'}</strong>
            ${r.observacao ? ` &bull; Obs: <em>"${r.observacao}"</em>` : ''}
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem;">
          ${!isAutorizado && !isHistory ? `
            <button class="btn-primary btn-sm" style="background: #10B981; border: none; font-weight: 700;" onclick="PortariaComponent.autorizarReserva('${r.id}')">
              <span class="material-symbols-outlined" style="font-size: 1rem;">check_circle</span> Autorizar Uso
            </button>
          ` : ''}

          <button class="btn-secondary btn-sm" onclick="PortariaComponent.openEditarObsModal('${r.id}', '${r.observacao || ''}')">
            <span class="material-symbols-outlined" style="font-size: 1rem;">edit_note</span> Obs
          </button>
        </div>
      </div>
    `;
  },

  autorizarReserva(id) {
    window.CondoStore.updateReservaStatus(id, 'Autorizado');
    App.showToast('✅ Acesso autorizado na Guarita com sucesso!', 'success');
    App.render();
  },

  openEditarObsModal(id, obsAtual) {
    const obs = prompt('Digite a observação para este agendamento (será salva na nuvem):', obsAtual);
    if (obs === null) return;

    window.CondoStore.updateReservaStatus(id, null, obs.trim());
    App.showToast('Observação salva na nuvem!', 'success');
    App.render();
  },

  openNovaReservaModal() {
    const moradores = (window.CondoStore.data.moradores || []).filter(m => m && m.status === 'Aprovado');

    const modalHtml = `
      <div class="modal-overlay active" id="modalNovaReservaPortaria" style="z-index: 99999;">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">
              ➕ Registrar Reserva Presencial (Portaria)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalNovaReservaPortaria').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="PortariaComponent.submeterNovaReserva(event)">
              <div class="form-group">
                <label class="form-label">Selecione o Morador</label>
                <select id="resMoradorSelect" class="form-control" required style="font-weight: 600;">
                  ${moradores.map(m => `
                    <option value="${m.id}" data-nome="${m.nome}" data-apto="${m.apartamento}" data-email="${m.email}">
                      ${m.nome} (Apto ${m.apartamento})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Área Comum</label>
                <select id="resAreaSelect" class="form-control" required style="font-weight: 600;">
                  <option value="Salão de Festas Principal">🎉 Salão de Festas Principal</option>
                  <option value="Churrasqueira Gourmet">🍖 Churrasqueira Gourmet</option>
                  <option value="Piscina Adulto & Infantil">🏊 Piscina Adulto &amp; Infantil</option>
                  <option value="Academia Fitness">🏋️ Academia Fitness</option>
                </select>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Data do Agendamento</label>
                  <input type="date" id="resDataInput" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Horário / Turno</label>
                  <input type="text" id="resHorarioInput" class="form-control" value="Turno Integral (08:00 às 22:00)" required>
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalNovaReservaPortaria').remove()">Cancelar</button>
                <button type="submit" class="btn-primary">Registrar Reserva</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('modalNovaReservaPortaria');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterNovaReserva(e) {
    e.preventDefault();
    const select = document.getElementById('resMoradorSelect');
    const selected = select.options[select.selectedIndex];

    const moradorNome = selected.getAttribute('data-nome');
    const apartamento = selected.getAttribute('data-apto');
    const email = selected.getAttribute('data-email');
    const area = document.getElementById('resAreaSelect').value;
    const data = document.getElementById('resDataInput').value;
    const horario = document.getElementById('resHorarioInput').value;

    window.CondoStore.addAgendamento({
      moradorNome,
      apartamento,
      email,
      area,
      data,
      horario
    });

    document.getElementById('modalNovaReservaPortaria').remove();
    App.showToast(`✅ Reserva da área "${area}" cadastrada com sucesso!`, 'success');
    App.render();
  }
};
