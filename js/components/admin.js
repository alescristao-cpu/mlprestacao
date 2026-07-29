/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo do Síndico
   Síndico: Alessandro Cristiano da Silva
   Ações da Administração Organizadas por Abas (Prioridade aos Pedidos de Autorização)
   ---------------------------------------------------- */

window.AdminComponent = {
  activeTab: 'autorizacao', // 'autorizacao' é a aba padrão priorizada

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isMasterAdmin = user && user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';

    if (!user || !isMasterAdmin) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3rem 1.5rem; max-width: 550px; margin: 2rem auto;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #C62828; display: block; margin-bottom: 0.5rem;">admin_panel_settings</span>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.3rem; margin-top: 0.5rem;">
            Acesso Restrito à Administração
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.75rem 0 1.25rem 0; line-height: 1.5;">
            Este painel é de uso exclusivo da conta oficial do Síndico <code>condominio.modern.life@gmail.com</code> para autorização, recusa, geração de senha temporária e gestão dos moradores.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="width: 100%; justify-content: center; padding: 0.85rem;">
            <span class="material-symbols-outlined">login</span> Entrar como Síndico (condominio.modern.life@gmail.com)
          </button>
        </div>
      `;
      return;
    }

    const moradores = data.moradores || [];
    let pendentes = moradores.filter(m => m && (m.status === 'Pendente' || m.status === 'Em Análise'));
    const ocorrencias = data.ocorrencias || [];

    // Garantia total: Resgatar solicitações pendentes registradas no canal de ocorrências / vault
    ocorrencias.forEach(o => {
      if (o && (o.categoria === 'Solicitação de Cadastro' || o.categoria === 'PendingMoradorVault') && (o.status === 'Pendente' || o.status === 'Pendente de Aprovação')) {
        const emailNorm = (o.moradorEmail || '').toLowerCase().trim();
        const existsInPendentes = pendentes.some(p => (p.email && p.email.toLowerCase().trim() === emailNorm) || p.id === o.moradorId);
        const alreadyApproved = moradores.some(m => (m.email && m.email.toLowerCase().trim() === emailNorm && m.status === 'Aprovado'));
        if (!existsInPendentes && !alreadyApproved) {
          pendentes.push({
            id: o.moradorId || o.id,
            nome: o.moradorNome || o.assunto || 'Morador Solicitante',
            email: o.moradorEmail || '',
            telefone: (o.respostas && o.respostas[0] && o.respostas[0].telefone) || '',
            apartamento: o.apartamento || '',
            status: 'Pendente',
            dataCadastro: o.data || new Date().toISOString().split('T')[0]
          });
        }
      }
    });

    const aprovados = moradores.filter(m => m && m.status === 'Aprovado');
    const recusados = moradores.filter(m => m && (m.status === 'Recusado' || m.status === 'Não Autorizado'));

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Banner Principal da Gestão -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.35rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> PAINEL ADMINISTRATIVO MASTER
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700;">
                Gestão do Síndico Alessandro Cristiano da Silva
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 2px;">
                E-mail oficial: <code>condominio.modern.life@gmail.com</code>
              </p>
            </div>

            <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); font-weight: 600; padding: 0.65rem 1rem;" onclick="AdminComponent.openAlterarSenhaSindicoModal()">
              <span class="material-symbols-outlined">key</span> Alterar Minha Senha
            </button>
          </div>
        </div>

        <!-- BARRA DE ABAS DA ADMINISTRAÇÃO (COM PRIORIDADE PARA PEDIDOS DE AUTORIZAÇÃO) -->
        <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; border-bottom: 2px solid var(--border-color);">
          
          <!-- Aba 1: Pedidos de Autorização (Prioritária) -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; ${this.activeTab === 'autorizacao' ? 'background: #E65100; color: white; border: none; box-shadow: 0 4px 12px rgba(230,81,0,0.3);' : 'background: white; color: #E65100; border: 1px solid #FFE0B2;'}" onclick="AdminComponent.setTab('autorizacao')">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">how_to_reg</span> 
            📝 Pedidos de Autorização (${pendentes.length})
            ${pendentes.length > 0 ? `<span class="badge" style="background: #FFD54F; color: #000; font-weight: 800; font-size: 0.72rem; margin-left: 4px;">Pendente</span>` : ''}
          </button>

          <!-- Aba 2: Central de Mensagens -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; ${this.activeTab === 'mensagens' ? 'background: var(--primary); color: white; border: none;' : 'background: white; color: var(--primary-dark); border: 1px solid var(--border-color);'}" onclick="AdminComponent.setTab('mensagens')">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">inbox</span> 
            💬 Mensagens dos Moradores (${ocorrencias.length})
          </button>

          <!-- Aba 3: Senha Temporária -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; ${this.activeTab === 'senhatemp' ? 'background: #D84315; color: white; border: none;' : 'background: white; color: #D84315; border: 1px solid #FFCCBC;'}" onclick="AdminComponent.setTab('senhatemp')">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">key</span> 
            🔑 Senha Temporária
          </button>

          <!-- Aba 4: Gestão de Moradores Autorizados -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; ${this.activeTab === 'moradores' ? 'background: var(--primary-dark); color: white; border: none;' : 'background: white; color: var(--primary-dark); border: 1px solid var(--border-color);'}" onclick="AdminComponent.setTab('moradores')">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">groups</span> 
            👥 Moradores Autorizados (${aprovados.length})
          </button>

          <!-- Aba 5: Cadastros Bloqueados (Se houver) -->
          ${recusados.length > 0 ? `
            <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; ${this.activeTab === 'bloqueados' ? 'background: #C62828; color: white; border: none;' : 'background: white; color: #C62828; border: 1px solid #FFCDD2;'}" onclick="AdminComponent.setTab('bloqueados')">
              <span class="material-symbols-outlined" style="font-size: 1.1rem;">block</span> 
              🚫 Bloqueados (${recusados.length})
            </button>
          ` : ''}

        </div>

        <!-- CONTEÚDO DAS ABAS -->

        <!-- CONTEÚDO DA ABA 1: PEDIDOS DE AUTORIZAÇÃO (PRIORITÁRIA) -->
        ${this.activeTab === 'autorizacao' ? `
          <div class="card-widget" style="border: 2px solid #E65100; padding: 1.35rem;">
            <div style="background: #FFF3E0; padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="font-weight: 800; color: #E65100; font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span class="material-symbols-outlined" style="font-size: 1.5rem;">how_to_reg</span> Pedidos de Autorização de Novos Cadastros (${pendentes.length})
                </div>
                <div style="font-size: 0.82rem; color: #D84315; margin-top: 2px;">
                  Estes moradores se cadastraram criando sua própria senha e aguardam sua aprovação para acessar o portal.
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn-primary" style="background: #E65100; color: white; font-weight: 700; padding: 0.65rem 1rem; font-size: 0.85rem; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;" onclick="AdminComponent.buscarNovosPedidosNuvem()">
                  <span class="material-symbols-outlined" style="font-size: 1.1rem;">sync</span> 🔄 Buscar Novos Pedidos na Nuvem
                </button>

                <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700; padding: 0.65rem 1rem; font-size: 0.85rem;" onclick="AdminComponent.openQuickApproveModal()">
                  <span class="material-symbols-outlined" style="color: var(--primary); font-size: 1.1rem;">person_add</span> ➕ Autorizar Morador Manualmente
                </button>
              </div>
            </div>

            ${pendentes.length === 0 ? `
              <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.95rem; background: var(--bg-app); border-radius: 8px;">
                <span class="material-symbols-outlined" style="font-size: 3rem; color: #2E6B42; display: block; margin-bottom: 0.5rem;">check_circle</span>
                <strong>Nenhum pedido de autorização pendente no momento!</strong><br>
                <span style="font-size: 0.85rem;">Todos os moradores que solicitaram acesso foram analisados e autorizados.</span>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${pendentes.map(p => `
                  <div style="background: var(--bg-app); border: 1px solid #FFE0B2; border-radius: 8px; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                      <div>
                        <strong style="font-size: 1.15rem; color: var(--primary-dark);">${p.nome}</strong>
                        <div style="font-size: 0.92rem; color: var(--text-main); font-weight: 700; margin-top: 2px;">Unidade / Apto: ${p.apartamento}</div>
                      </div>
                      <span class="badge badge-warning" style="font-size: 0.8rem; background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2;">Aguardando Sua Aprovação</span>
                    </div>

                    <div style="font-size: 0.85rem; color: var(--text-muted); background: white; padding: 0.85rem; border-radius: 6px; border: 1px solid var(--border-light);">
                      <div>📧 E-mail: <strong>${p.email}</strong></div>
                      <div>📱 Telefone: <strong>${p.telefone || 'Não informado'}</strong></div>
                      <div>📅 Data do Cadastro: <strong>${p.dataCadastro || 'Hoje'}</strong></div>
                    </div>

                    <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.25rem;">
                      <button class="btn-primary" style="flex: 1; justify-content: center; background: #2E6B42; padding: 0.85rem; font-weight: 700; min-width: 170px;" onclick="AdminComponent.aprovarMorador('${p.id}', '${p.nome}', '${p.email}', '${p.apartamento}')">
                        <span class="material-symbols-outlined" style="font-size: 1.1rem;">check_circle</span> ✅ Autorizar Acesso do Morador
                      </button>

                      <button class="btn-secondary btn-danger" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; padding: 0.85rem; font-weight: 700;" onclick="AdminComponent.recusarMorador('${p.id}', '${p.nome}')">
                        <span class="material-symbols-outlined" style="font-size: 1.1rem;">block</span> 🚫 Não Autorizar / Recusar
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}

        <!-- CONTEÚDO DA ABA 2: CENTRAL DE MENSAGENS -->
        ${this.activeTab === 'mensagens' ? `
          <div class="card-widget" style="border: 2px solid var(--primary); padding: 1.25rem;">
            <div class="card-header" style="margin-bottom: 1rem;">
              <div class="card-title" style="color: var(--primary-dark); font-size: 1.15rem;">
                <span class="material-symbols-outlined" style="color: var(--primary); font-size: 1.5rem;">inbox</span>
                Central de Mensagens do Gestor (Canal Direto, Reclamações &amp; Elogios)
              </div>
              <span class="badge badge-info">${ocorrencias.length} Mensagens Recebidas</span>
            </div>

            ${ocorrencias.length === 0 ? `
              <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; background: var(--bg-app); border-radius: 8px;">
                <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.4; display: block; margin-bottom: 0.3rem;">chat_bubble_outline</span>
                Nenhuma mensagem ou reclamação registrada pelos moradores até o momento.
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${ocorrencias.map(o => `
                  <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                      <div>
                        <span class="badge ${o.categoria === 'Reclamação' ? 'badge-danger' : o.categoria === 'Elogio' ? 'badge-success' : o.categoria === 'Recuperação de Senha' ? 'badge-warning' : 'badge-info'}" style="margin-bottom: 4px;">
                          ${o.categoria || 'Canal Direto'}
                        </span>
                        <h4 style="font-family: var(--font-heading); font-weight: 700; color: var(--primary-dark); font-size: 1.05rem;">
                          ${o.assunto}
                        </h4>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">
                          De: <strong>${o.moradorNome} (Apto ${o.apartamento})</strong> &bull; Enviado em: ${o.data}
                        </div>
                      </div>

                      <span class="badge ${o.status.includes('Respondido') ? 'badge-success' : 'badge-warning'}">
                        ${o.status}
                      </span>
                    </div>

                    <p style="font-size: 0.9rem; color: var(--text-main); background: white; padding: 0.75rem 0.85rem; border-radius: 6px; border: 1px solid var(--border-light); white-space: pre-line;">
                      ${o.descricao}
                    </p>

                    <!-- Histórico de Respostas -->
                    ${(o.respostas && o.respostas.length > 0) ? `
                      <div style="display: flex; flex-direction: column; gap: 0.4rem; background: #E8F5E9; padding: 0.75rem; border-radius: 6px; border-left: 3px solid #2E6B42;">
                        <strong style="font-size: 0.8rem; color: #1F4D30;">💬 Sua Resposta Enviada:</strong>
                        ${o.respostas.map(r => `
                          <div style="font-size: 0.85rem; color: var(--text-main);">
                            <div style="font-weight: 700; font-size: 0.78rem; color: #2E6B42;">${r.autor} (${r.data}):</div>
                            <div>${r.texto}</div>
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}

                    <!-- Botões de Ação para o Síndico -->
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem; flex-wrap: wrap;">
                      <input type="text" id="adminResp_${o.id}" class="form-control" placeholder="Escreva a resposta para o morador..." style="font-size: 0.85rem; flex: 1; min-width: 200px;">
                      
                      <button class="btn-primary btn-sm" style="background: #2E6B42; font-weight: 700;" onclick="AdminComponent.responderMensagemMorador('${o.id}')">
                        <span class="material-symbols-outlined" style="font-size: 0.95rem;">send</span> Responder
                      </button>

                      ${o.categoria === 'Recuperação de Senha' && o.moradorEmail ? `
                        <button class="btn-secondary btn-sm" style="background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2; font-weight: 700;" onclick="AdminComponent.gerarSenhaTemporariaPorEmail('${o.moradorEmail}')" title="Gerar Senha Temporária para quem esqueceu a senha">
                          <span class="material-symbols-outlined" style="font-size: 0.95rem;">key</span> 🔑 Senha Temporária
                        </button>
                      ` : ''}
                    </div>

                  </div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}

        <!-- CONTEÚDO DA ABA 3: SENHA TEMPORÁRIA -->
        ${this.activeTab === 'senhatemp' ? `
          <div class="card-widget" style="border: 2px solid #D84315; padding: 1.35rem;">
            <div style="background: #FBE9E7; padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem;">
              <h3 style="color: #D84315; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                <span class="material-symbols-outlined">key</span> Gerador de Senhas Temporárias
              </h3>
              <p style="font-size: 0.85rem; color: #BF360C; margin-top: 4px; line-height: 1.5;">
                A senha temporária é exclusiva para <strong>moradores já cadastrados que esqueceram a senha</strong>. No primeiro acesso com essa senha temporária, o morador será obrigado a cadastrar sua nova senha pessoal.
              </p>

              <button class="btn-primary" style="background: #D84315; color: white; font-weight: 700; margin-top: 0.85rem; padding: 0.8rem 1.2rem; font-size: 0.92rem;" onclick="AdminComponent.openSeletorSenhaTemporariaModal()">
                <span class="material-symbols-outlined">key</span> 🔑 Selecionar Morador e Gerar Senha Temporária
              </button>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--bg-app); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <strong style="color: var(--primary-dark); display: block; margin-bottom: 4px;">📱 Canais de Entrega Instantânea:</strong>
              1. Envio automático de notificação por e-mail.<br>
              2. Botão de 1-clique para encaminhar a senha direto no **WhatsApp do Morador**.<br>
              3. Opção de copiar para a área de transferência.
            </div>
          </div>
        ` : ''}

        <!-- CONTEÚDO DA ABA 4: MORADORES AUTORIZADOS -->
        ${this.activeTab === 'moradores' ? `
          <div class="card-widget" style="padding: 1.25rem;">
            <div class="card-header" style="margin-bottom: 1rem;">
              <div class="card-title" style="font-size: 1.15rem; color: var(--primary-dark);">
                <span class="material-symbols-outlined">groups</span> Moradores Com Acesso Autorizado (${aprovados.length})
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${aprovados.map(m => {
                const isAdmin = m.role === 'Administrador' || m.id === 'usr_sindico' || m.email.toLowerCase() === 'condominio.modern.life@gmail.com';
                const isConselheiro = m.role === 'Conselheiro';

                return `
                  <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                    <div>
                      <div style="font-weight: 700; font-size: 1rem; color: var(--primary-dark); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                        ${m.nome}
                        ${isAdmin ? '<span class="badge badge-info" style="font-size: 0.72rem;">Síndico Master</span>' : ''}
                        ${isConselheiro ? '<span class="badge badge-success" style="font-size: 0.72rem; background: #D1E7DD; color: #0F5132;">👑 Conselheiro</span>' : ''}
                        ${m.senhaTemporaria ? '<span class="badge badge-warning" style="font-size: 0.72rem;">🔑 Senha Temporária Pendente</span>' : ''}
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-main); margin-top: 2px;">
                        <strong>Apto ${m.apartamento}</strong> &bull; 📧 ${m.email} &bull; 📱 ${m.telefone || 'Sem telefone'}
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                      <button class="btn-primary btn-sm" style="background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2; font-weight: 700;" onclick="AdminComponent.gerarSenhaTemporariaModal('${m.id}')" title="Gerar Senha Temporária caso o Morador tenha esquecido a senha">
                        <span class="material-symbols-outlined" style="font-size: 0.95rem;">key</span> 🔑 Senha Temporária
                      </button>

                      <button class="btn-outline-primary btn-sm" onclick="AdminComponent.openEditMoradorModal('${m.id}')" title="Editar dados do morador">
                        <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit</span> Editar
                      </button>

                      ${isAdmin ? `
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-left: 4px;">
                          🔒 Administrador Master
                        </span>
                      ` : `
                        <button class="btn-secondary btn-sm" style="background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2;" onclick="AdminComponent.recusarMorador('${m.id}', '${m.nome}')" title="Bloquear / Revogar acesso">
                          <span class="material-symbols-outlined" style="font-size: 0.95rem;">block</span> Bloquear
                        </button>

                        <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828;" onclick="AdminComponent.excluirMorador('${m.id}', '${m.nome}', '${m.apartamento}')" title="Excluir cadastro">
                          <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir
                        </button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- CONTEÚDO DA ABA 5: CADASTROS BLOQUEADOS -->
        ${this.activeTab === 'bloqueados' && recusados.length > 0 ? `
          <div class="card-widget" style="border: 1px solid #FFCDD2; padding: 1.25rem;">
            <div class="card-header" style="margin-bottom: 0.85rem;">
              <div class="card-title" style="color: #C62828;">
                <span class="material-symbols-outlined">block</span> Cadastros Não Autorizados / Recusados (${recusados.length})
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${recusados.map(r => `
                <div style="background: #FFEBEE; border: 1px solid #FFCDD2; border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <strong style="color: #C62828;">${r.nome}</strong> (Apto ${r.apartamento}) &bull; ${r.email}
                    <div style="font-size: 0.78rem; color: #B71C1C; margin-top: 2px;">Status: Acesso Não Autorizado pelo Síndico</div>
                  </div>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn-primary btn-sm" style="background: #2E6B42;" onclick="AdminComponent.aprovarMorador('${r.id}', '${r.nome}', '${r.email}', '${r.apartamento}')">
                      <span class="material-symbols-outlined" style="font-size: 0.9rem;">check_circle</span> Re-Autorizar
                    </button>
                    <button class="btn-secondary btn-sm btn-danger" style="background: white; color: #C62828;" onclick="AdminComponent.excluirMorador('${r.id}', '${r.nome}', '${r.apartamento}')">
                      <span class="material-symbols-outlined" style="font-size: 0.9rem;">delete</span> Excluir
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  async buscarNovosPedidosNuvem() {
    if (window.App) App.showToast('🔍 Consultando banco de dados em nuvem Supabase...', 'info');
    try {
      if (window.CondoStore) {
        window.CondoStore.isSyncing = false;
        await window.CondoStore.pullFromCloudSilently();
      }
      if (window.App) App.render();
      const pendentes = (window.CondoStore && window.CondoStore.data && window.CondoStore.data.moradores) 
        ? window.CondoStore.data.moradores.filter(m => m && (m.status === 'Pendente' || m.status === 'Em Análise')) 
        : [];
      if (pendentes.length > 0) {
        if (window.App) App.showToast(`✅ ${pendentes.length} pedido(s) de autorização pendente(s) encontrado(s)!`, 'success');
      } else {
        if (window.App) App.showToast('✅ Consulta concluída. Nenhum novo pedido pendente no momento.', 'info');
      }
    } catch (e) {
      if (window.App) App.showToast('⚠️ Erro ao consultar a nuvem: ' + e.message, 'error');
    }
  },

  setTab(tabName) {
    this.activeTab = tabName;
    App.render();
  },

  aprovarMorador(id, nome, email, apartamento) {
    window.CondoStore.updateMoradorStatus(id, 'Aprovado');

    if (email) {
      try {
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `[MODERN LIFE RESIDENCE] Seu Acesso ao Portal Foi Autorizado pelo Síndico!`,
            "Nome do Morador": nome || 'Morador',
            "Unidade / Apto": apartamento || '',
            "E-mail de Acesso": email,
            "Status": "AUTORIZADO",
            "Instruções": "Seu acesso ao portal oficial foi aprovado pelo Síndico Alessandro. Você já pode entrar utilizando o seu e-mail e a senha cadastrada.",
            "Link do Portal": "https://mlprestacao.vercel.app"
          })
        }).catch(() => {});
      } catch (e) {}
    }

    App.showToast(`Acesso do morador "${nome}" AUTORIZADO com sucesso!`, 'success');
    App.render();
  },

  enviarEmailSenhaTemporaria(morador, senhaTemp) {
    if (!morador || !morador.email) return;
    
    try {
      fetch(`https://formsubmit.co/ajax/${morador.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[MODERN LIFE RESIDENCE] Sua Senha Temporária de Acesso (Apto ${morador.apartamento})`,
          "Nome do Morador": morador.nome,
          "Unidade / Apto": morador.apartamento,
          "E-mail de Acesso": morador.email,
          "Senha Temporária": senhaTemp,
          "Instruções": "Utilize a senha temporária acima para entrar no portal. No primeiro acesso, o sistema solicitará obrigatoriamente que você cadastre a sua nova senha pessoal.",
          "Link do Portal": "https://mlprestacao.vercel.app",
          "Data da Solicitação": new Date().toLocaleString("pt-BR")
        })
      }).catch(() => {});
    } catch (e) {}

    try {
      fetch(`https://formsubmit.co/ajax/condominio.modern.life@gmail.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[SENHA TEMPORÁRIA ENTREGUE] Morador ${morador.nome} (${morador.email})`,
          "Nome do Morador": morador.nome,
          "Unidade / Apto": morador.apartamento,
          "E-mail do Morador": morador.email,
          "Senha Temporária": senhaTemp,
          "Data de Emissão": new Date().toLocaleString("pt-BR")
        })
      }).catch(() => {});
    } catch (e) {}
  },

  exibirSucessoSenhaTemporariaModal(morador, senhaTemp) {
    const existing = document.getElementById('modalSucessoSenhaTemp');
    if (existing) existing.remove();

    const msgWhatsapp = encodeURIComponent(`Olá, ${morador.nome}! Sua senha temporária de acesso ao portal do Modern Life Residence é: *${senhaTemp}*\n\nAcesse https://mlprestacao.vercel.app com seu e-mail (${morador.email}) e use essa senha para cadastrar sua nova senha pessoal no primeiro acesso.`);
    const telClean = (morador.telefone || '').replace(/\D/g, '');
    const waUrl = telClean ? `https://api.whatsapp.com/send?phone=55${telClean}&text=${msgWhatsapp}` : `https://api.whatsapp.com/send?text=${msgWhatsapp}`;

    const modalHtml = `
      <div class="modal-overlay active" id="modalSucessoSenhaTemp" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 520px; border: 2px solid #E65100;">
          <div class="modal-header" style="background: #E65100; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              🔑 Senha Temporária Gerada com Sucesso!
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalSucessoSenhaTemp').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="background: #FFF8E1; border: 1px solid #FFE0B2; padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: #E65100; margin-bottom: 1.25rem;">
              <strong>Morador:</strong> ${morador.nome} (Apto ${morador.apartamento})<br>
              <strong>E-mail:</strong> <code>${morador.email}</code><br>
              <div style="font-size: 1.25rem; font-weight: 800; color: #D84315; margin-top: 8px; background: white; padding: 0.6rem; border-radius: 6px; text-align: center; border: 1px dashed #FF7043; letter-spacing: 1.5px;">
                🔑 ${senhaTemp}
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
              Um e-mail de notificação foi disparado para <strong>${morador.email}</strong>. Você também pode enviar a senha temporária instantaneamente pelo WhatsApp ou copiá-la abaixo:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              <a href="${waUrl}" target="_blank" class="btn-primary" style="background: #25D366; color: white; justify-content: center; font-weight: 700; text-decoration: none; padding: 0.85rem;">
                <span class="material-symbols-outlined">send</span> 📱 Enviar Senha no WhatsApp do Morador
              </a>

              <button class="btn-secondary" style="justify-content: center; font-weight: 700; padding: 0.8rem;" onclick="navigator.clipboard.writeText('${senhaTemp}'); alert('Senha temporária ${senhaTemp} copiada!');">
                <span class="material-symbols-outlined">content_copy</span> 📋 Copiar Senha Temporária
              </button>

              <button class="btn-outline-primary" style="justify-content: center; padding: 0.75rem; margin-top: 0.25rem;" onclick="document.getElementById('modalSucessoSenhaTemp').remove(); App.render();">
                Concluído
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  openSeletorSenhaTemporariaModal() {
    const existing = document.getElementById('modalSeletorSenhaTemp');
    if (existing) existing.remove();

    const moradores = (window.CondoStore.data.moradores || []).filter(m => m.role !== 'Administrador');

    const modalHtml = `
      <div class="modal-overlay active" id="modalSeletorSenhaTemp">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              🔑 Gerar Senha Temporária (Para Quem Esqueceu a Senha)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalSeletorSenhaTemp').remove()">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
              Selecione o <strong>morador já cadastrado que esqueceu a senha</strong> para gerar uma senha temporária.
            </p>

            <form onsubmit="AdminComponent.submeterSeletorSenhaTemp(event)">
              <div class="form-group">
                <label class="form-label">Selecione o Morador</label>
                <select id="selectMoradorTemp" class="form-control" required style="font-weight: 600;">
                  ${moradores.map(m => `
                    <option value="${m.id}">${m.nome} (Apto ${m.apartamento} - ${m.email})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Senha Temporária</label>
                <input type="text" id="inputSenhaTempManual" class="form-control" value="Temp${Math.floor(1000 + Math.random() * 9000)}" required style="font-weight: 700; color: #E65100; letter-spacing: 1px;">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700; background: #E65100;">
                <span class="material-symbols-outlined">send</span> Confirmar e Gerar Senha Temporária
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterSeletorSenhaTemp(e) {
    e.preventDefault();
    const moradorId = document.getElementById('selectMoradorTemp').value;
    const senhaTemp = document.getElementById('inputSenhaTempManual').value.trim();

    if (!moradorId || !senhaTemp) return;

    const morador = window.CondoStore.data.moradores.find(m => m.id === moradorId);
    if (!morador) return;

    window.CondoStore.gerarSenhaTemporaria(morador.id, senhaTemp);
    this.enviarEmailSenhaTemporaria(morador, senhaTemp);

    document.getElementById('modalSeletorSenhaTemp').remove();
    this.exibirSucessoSenhaTemporariaModal(morador, senhaTemp);
  },

  gerarSenhaTemporariaPorEmail(emailMorador) {
    const morador = window.CondoStore.data.moradores.find(m => m.email.toLowerCase().trim() === emailMorador.toLowerCase().trim());
    if (morador) {
      this.gerarSenhaTemporariaModal(morador.id);
    } else {
      alert(`Morador com e-mail "${emailMorador}" não foi localizado no cadastro.`);
    }
  },

  gerarSenhaTemporariaModal(moradorId) {
    const morador = window.CondoStore.data.moradores.find(m => m.id === moradorId);
    if (!morador) return;

    const tempAuto = 'Temp' + Math.floor(1000 + Math.random() * 9000);
    const senhaFinal = prompt(`Digite ou confirme a Senha Temporária para o morador "${morador.nome}" (Apto ${morador.apartamento}):\n\nNo primeiro acesso, o morador cadastrará a sua nova senha pessoal.`, tempAuto);

    if (senhaFinal === null) return;

    const s = senhaFinal.trim();
    if (!s) {
      alert('Digite uma senha temporária válida.');
      return;
    }

    window.CondoStore.gerarSenhaTemporaria(morador.id, s);
    this.enviarEmailSenhaTemporaria(morador, s);
    this.exibirSucessoSenhaTemporariaModal(morador, s);
  },

  responderMensagemMorador(ocoId) {
    const input = document.getElementById('adminResp_' + ocoId);
    const text = input ? input.value.trim() : '';

    if (!text) {
      alert('Por favor, digite a resposta para o morador.');
      return;
    }

    const success = window.CondoStore.addRespostaOcorrencia(ocoId, text, 'Síndico Alessandro Cristiano da Silva');
    if (success) {
      App.showToast('Resposta publicada e disponibilizada para o morador!', 'success');
      App.render();
    }
  },

  openAlterarSenhaSindicoModal() {
    const existing = document.getElementById('modalSenhaSindico');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalSenhaSindico">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">
              🔑 Alterar Senha do Administrador Master (Síndico)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalSenhaSindico').remove()">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              E-mail master: <code>condominio.modern.life@gmail.com</code>
            </p>
            <form onsubmit="AdminComponent.submeterTrocaSenhaSindico(event)">
              <div class="form-group">
                <label class="form-label">Nova Senha de Acesso do Síndico</label>
                <input type="password" id="novaSenhaSindico" class="form-control" placeholder="Digite sua nova senha" required minlength="6">
              </div>

              <div class="form-group">
                <label class="form-label">Confirme a Nova Senha</label>
                <input type="password" id="confirmaSenhaSindico" class="form-control" placeholder="Repita a nova senha" required minlength="6">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
                <span class="material-symbols-outlined">save</span> Atualizar Senha Master
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterTrocaSenhaSindico(e) {
    e.preventDefault();
    const s1 = document.getElementById('novaSenhaSindico').value;
    const s2 = document.getElementById('confirmaSenhaSindico').value;

    if (s1 !== s2) {
      alert('As senhas digitadas não coincidem!');
      return;
    }

    const sindico = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === 'condominio.modern.life@gmail.com');
    if (sindico) {
      sindico.senha = s1;
      window.CondoStore.saveData();
      App.showToast('Senha master do Síndico alterada com sucesso!', 'success');
      document.getElementById('modalSenhaSindico').remove();
    }
  },

  openEditMoradorModal(moradorId) {
    const morador = window.CondoStore.data.moradores.find(m => m.id === moradorId);
    if (!morador) return;

    const existing = document.getElementById('modalEditMorador');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEditMorador">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              ✏️ Editar Morador &amp; Redefinir Senha
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalEditMorador').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="AdminComponent.submeterEdicaoMorador(event, '${morador.id}')">
              
              <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="editNome" class="form-control" value="${morador.nome}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Função / Perfil no Condomínio</label>
                <select id="editRole" class="form-control" style="font-weight: 700;" required>
                  <option value="Morador" ${morador.role === 'Morador' ? 'selected' : ''}>🏡 Morador Padrão</option>
                  <option value="Conselheiro" ${morador.role === 'Conselheiro' ? 'selected' : ''}>👑 Conselheiro (Conselho Consultivo / Fiscal)</option>
                  <option value="Portaria" ${morador.role === 'Portaria' ? 'selected' : ''}>🚪 Portaria &amp; Guarita</option>
                  <option value="Administrador" ${morador.role === 'Administrador' ? 'selected' : ''}>🛡️ Administrador (Síndico)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail Principal</label>
                <input type="email" id="editEmail" class="form-control" value="${morador.email}" required>
              </div>

              <div class="form-group" style="background: #F5F5F5; padding: 0.85rem; border-radius: 6px; border: 1px dashed #CCCCCC;">
                <label class="form-label" style="color: var(--primary-dark); font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 1.1rem; color: var(--primary);">key</span>
                  Entregar Senha Temporária (Se Esqueceu a Senha)
                </label>
                <input type="password" id="editSenha" class="form-control" value="" placeholder="Digite a senha temporária se desejar resetar" autocomplete="new-password">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">
                  🔒 Por segurança, a senha atual fica oculta. Ao digitar uma nova senha aqui, ela será tratada como temporária e enviada ao e-mail do morador.
                </span>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="editApto" class="form-control" value="${morador.apartamento}" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Telefone / WhatsApp</label>
                  <input type="tel" id="editTelefone" class="form-control" value="${morador.telefone || ''}">
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalEditMorador').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="padding: 0.8rem 1.4rem;">
                  <span class="material-symbols-outlined">save</span> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterEdicaoMorador(e, moradorId) {
    e.preventDefault();
    const nome = document.getElementById('editNome').value.trim();
    const role = document.getElementById('editRole').value;
    const email = document.getElementById('editEmail').value.trim();
    const novaSenha = document.getElementById('editSenha').value.trim();
    const apartamento = document.getElementById('editApto').value.trim();
    const telefone = document.getElementById('editTelefone').value.trim();

    const payload = {
      nome,
      role,
      email,
      apartamento,
      telefone
    };

    if (novaSenha) {
      payload.senha = novaSenha;
      payload.senhaTemporaria = true;
    }

    const res = window.CondoStore.updateMoradorDetails(moradorId, payload);

    if (res.success) {
      if (novaSenha) {
        this.enviarEmailSenhaTemporaria(res.morador, novaSenha);
        document.getElementById('modalEditMorador').remove();
        this.exibirSucessoSenhaTemporariaModal(res.morador, novaSenha);
      } else {
        App.showToast(`Morador "${nome}" atualizado!`, 'success');
        document.getElementById('modalEditMorador').remove();
        App.render();
      }
    } else {
      alert(res.message);
    }
  },

  openQuickApproveModal() {
    const existing = document.getElementById('modalQuickApprove');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalQuickApprove">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              ➕ Autorizar Novo Morador Manualmente
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalQuickApprove').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="AdminComponent.submeterAprovacaoRapida(event)">
              <div class="form-group">
                <label class="form-label">Nome Completo do Morador</label>
                <input type="text" id="quickNome" class="form-control" placeholder="Ex: João da Silva" required>
              </div>

              <div class="form-group">
                <label class="form-label">Função / Perfil no Condomínio</label>
                <select id="quickRole" class="form-control" style="font-weight: 700;" required>
                  <option value="Morador">🏡 Morador Padrão</option>
                  <option value="Conselheiro">👑 Conselheiro (Conselho Consultivo / Fiscal)</option>
                  <option value="Portaria">🚪 Portaria &amp; Guarita</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail do Morador</label>
                <input type="email" id="quickEmail" class="form-control" placeholder="morador@exemplo.com" required>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="quickApto" class="form-control" placeholder="Ex: Apt 402" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Telefone / WhatsApp</label>
                  <input type="tel" id="quickTelefone" class="form-control" placeholder="(11) 99999-9999">
                </div>
              </div>

              <div style="background: #E8F5E9; border: 1px solid #C8E6C9; padding: 0.85rem; border-radius: 8px; font-size: 0.82rem; color: #2E6B42; margin-bottom: 1rem;">
                <span class="material-symbols-outlined" style="font-size: 1.1rem; vertical-align: middle;">info</span>
                <strong>Sem necessidade de senha!</strong> O morador criará a sua própria senha pessoal no primeiro acesso ao entrar no portal.
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
                <span class="material-symbols-outlined">check_circle</span> Autorizar e Conceder Acesso
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterAprovacaoRapida(e) {
    e.preventDefault();
    const nome = document.getElementById('quickNome').value.trim();
    const role = document.getElementById('quickRole').value;
    const email = document.getElementById('quickEmail').value.trim();
    const apartamento = document.getElementById('quickApto').value.trim();
    const telefone = document.getElementById('quickTelefone') ? document.getElementById('quickTelefone').value.trim() : '';

    const senhaProvisoria = '123456';

    const res = window.CondoStore.addMorador({
      nome,
      role,
      email,
      senha: senhaProvisoria,
      senhaTemporaria: true, // Obriga o morador a criar sua própria senha no primeiro acesso
      telefone,
      apartamento,
      cpf: 'Autorizado Pelo Síndico'
    });

    if (!res.success) {
      alert(`⚠️ RECUSADO:\n\n${res.message}`);
      return;
    }

    // 1. Autorização instantânea no mesmo milissegundo
    window.CondoStore.updateMoradorStatus(res.morador.id, 'Aprovado');

    // 2. Envio imediato de e-mail de notificação ao morador informando que criará sua própria senha
    if (email) {
      try {
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `[MODERN LIFE RESIDENCE] Seu Acesso Foi Autorizado! Crie sua Senha no Primeiro Acesso`,
            "Nome do Morador": nome || 'Morador',
            "Unidade / Apto": apartamento || '',
            "E-mail de Acesso": email,
            "Senha Inicial Provisória": senhaProvisoria,
            "Status": "AUTORIZADO",
            "Instruções Importantes": `Seu acesso foi ativado pelo Síndico Alessandro. Ao entrar com o e-mail (${email}) e a senha provisória (${senhaProvisoria}), o portal exibirá a tela para você cadastrar a sua nova senha pessoal.`,
            "Link do Portal": "https://mlprestacao.vercel.app"
          })
        }).catch(() => {});
      } catch (e) {}
    }

    App.showToast(`✅ Acesso do morador "${nome}" (Apto ${apartamento}) AUTORIZADO instantaneamente!`, 'success');
    const modalQuick = document.getElementById('modalQuickApprove');
    if (modalQuick) modalQuick.remove();
    App.render();
  },

  recusarMorador(id, nome) {
    if (!confirm(`Deseja NÃO AUTORIZAR o acesso do morador "${nome}"?`)) {
      return;
    }
    window.CondoStore.updateMoradorStatus(id, 'Recusado');
    App.showToast(`Solicitação de "${nome}" foi RECUSADA (Não Autorizada).`, 'info');
    App.render();
  },

  excluirMorador(id, nome, apto) {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente o cadastro de "${nome}" (Apto ${apto})?`)) {
      return;
    }

    const res = window.CondoStore.deleteMorador(id);
    if (res.success) {
      App.showToast(`Cadastro do morador "${nome}" foi excluído.`, 'success');
      App.render();
    } else {
      alert(res.message);
    }
  }
};
