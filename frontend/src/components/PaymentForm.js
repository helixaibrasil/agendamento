import api from '../services/api.js';

export class PaymentForm {
  constructor(agendamentoData) {
    this.agendamentoData = agendamentoData;
    this.mp = null;
    this.cardForm = null;
    this.publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
    this.sdkReady = false;
  }

  async init() {
    try {
      // Wait for MercadoPago SDK to be loaded
      if (typeof MercadoPago === 'undefined') {
        console.log('Aguardando SDK do Mercado Pago...');
        await this.waitForMercadoPagoSDK();
      }

      // Initialize Mercado Pago SDK
      console.log('Inicializando Mercado Pago com Public Key:', this.publicKey);
      this.mp = new MercadoPago(this.publicKey, {
        locale: 'pt-BR'
      });
      this.sdkReady = true;
      console.log('Mercado Pago SDK inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar Mercado Pago SDK:', error);
      alert('Erro ao carregar sistema de pagamento. Recarregue a página.');
    }
  }

  async waitForMercadoPagoSDK() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;

      const checkSDK = setInterval(() => {
        attempts++;
        if (typeof MercadoPago !== 'undefined') {
          clearInterval(checkSDK);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkSDK);
          reject(new Error('MercadoPago SDK não carregou'));
        }
      }, 100);
    });
  }

  async render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ensure SDK is initialized
    if (!this.sdkReady) {
      await this.init();
    }

    container.innerHTML = `
      <div class="payment-container">
        <h2 style="text-align: center; color: var(--brand-primary); margin-bottom: var(--spacing-6);">
          Finalize seu Pagamento
        </h2>

        <div class="payment-summary" style="background: var(--bg-secondary); padding: var(--spacing-6); border-radius: var(--radius-lg); margin-bottom: var(--spacing-8);">
          <h3 style="margin-bottom: var(--spacing-4);">Resumo do Agendamento</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-3);">
            <span><strong>Tipo:</strong></span>
            <span>${this.getTipoVistoriaLabel(this.agendamentoData.tipo_vistoria)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-3);">
            <span><strong>Data:</strong></span>
            <span>${this.formatDate(this.agendamentoData.data_agendamento)} às ${this.agendamentoData.horario_agendamento}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-3);">
            <span><strong>Cliente:</strong></span>
            <span>${this.agendamentoData.cliente_nome}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-4); border-top: 2px solid var(--border-medium); font-size: var(--text-xl); font-weight: var(--font-bold);">
            <span>Total:</span>
            <span style="color: var(--brand-primary);">R$ ${(this.agendamentoData.preco / 100).toFixed(2)}</span>
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="payment-methods" style="margin-bottom: var(--spacing-6);">
          <h3 style="margin-bottom: var(--spacing-4);">Escolha a forma de pagamento</h3>
          <div class="payment-method-tabs" style="display: flex; gap: var(--spacing-4); margin-bottom: var(--spacing-6);">
            <button class="payment-tab active" data-method="pix" style="flex: 1; padding: var(--spacing-4); border: 2px solid var(--brand-primary); background: var(--brand-primary); color: white; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-semibold); transition: all var(--transition-fast);">
              <span style="font-size: var(--text-lg);">💳</span> PIX
            </button>
            <button class="payment-tab" data-method="card" style="flex: 1; padding: var(--spacing-4); border: 2px solid var(--border-medium); background: white; color: var(--text-primary); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-semibold); transition: all var(--transition-fast);">
              <span style="font-size: var(--text-lg);">💳</span> Cartão
            </button>
          </div>
        </div>

        <!-- PIX Payment -->
        <div id="pixPayment" class="payment-section active">
          <div style="text-align: center; padding: var(--spacing-8); background: var(--bg-secondary); border-radius: var(--radius-lg);">
            <p style="margin-bottom: var(--spacing-6); color: var(--text-secondary);">
              Pague com PIX de forma rápida e segura
            </p>
            <button id="generatePixBtn" class="btn btn-primary btn-large" style="width: 100%; max-width: 400px; margin-bottom: var(--spacing-4);">
              Gerar QR Code PIX
            </button>

            <div style="margin-top: var(--spacing-6); padding-top: var(--spacing-6); border-top: 1px solid var(--border-light);">
              <p style="margin-bottom: var(--spacing-3); color: var(--text-tertiary); font-size: var(--text-sm);">
                🧪 Modo de Teste
              </p>
              <button id="simulatePixApprovedBtn" class="btn btn-secondary" style="width: 100%; max-width: 400px;">
                ✅ Simular Pagamento Aprovado
              </button>
            </div>
          </div>

          <div id="pixQrCode" style="display: none; text-align: center; padding: var(--spacing-8); background: white; border-radius: var(--radius-lg); border: 2px solid var(--brand-primary); margin-top: var(--spacing-6);">
            <h3 style="margin-bottom: var(--spacing-4);">Escaneie o QR Code</h3>
            <div id="qrCodeImage" style="margin: var(--spacing-6) auto;"></div>
            <div style="background: var(--bg-secondary); padding: var(--spacing-4); border-radius: var(--radius-md); margin-top: var(--spacing-4);">
              <p style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--spacing-2);">
                Ou copie o código PIX:
              </p>
              <div style="display: flex; gap: var(--spacing-3); align-items: center;">
                <input type="text" id="pixCode" readonly style="flex: 1; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md); font-family: monospace; font-size: var(--text-sm);">
                <button id="copyPixBtn" class="btn btn-secondary">Copiar</button>
              </div>
            </div>
            <p style="margin-top: var(--spacing-6); color: var(--text-secondary); font-size: var(--text-sm);">
              ⏱️ Aguardando pagamento...
            </p>
          </div>
        </div>

        <!-- Card Payment -->
        <div id="cardPayment" class="payment-section" style="display: none;">
          <!-- Auto-fill Test Button -->
          <div style="background: #E3F2FD; border: 2px solid #2196F3; padding: var(--spacing-4); margin-bottom: var(--spacing-6); border-radius: var(--radius-md); text-align: center;">
            <button type="button" id="autoFillTestData" class="btn btn-secondary" style="background: #2196F3; border-color: #2196F3; color: white; padding: var(--spacing-3) var(--spacing-6);">
              🧪 Preencher com Dados de Teste
            </button>
            <p style="margin: var(--spacing-2) 0 0 0; font-size: var(--text-sm); color: #1976D2;">
              Clique para usar cartão de teste do Mercado Pago
            </p>
          </div>

          <form id="cardPaymentForm">
            <div style="margin-bottom: var(--spacing-5);">
              <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">
                Número do Cartão *
                <span id="cardNumberHint" style="font-weight: normal; color: #2196F3; font-size: var(--text-sm); display: none;">
                  (Teste: 5031 4332 1540 6351)
                </span>
              </label>
              <div id="form-checkout__cardNumber" class="mp-input" style="min-height: 48px;">
                <div class="mp-loading" style="padding: var(--spacing-3); color: var(--text-tertiary);">Carregando...</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); margin-bottom: var(--spacing-5);">
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">
                  Vencimento *
                  <span id="expiryHint" style="font-weight: normal; color: #2196F3; font-size: var(--text-sm); display: none;">
                    (Teste: 11/30)
                  </span>
                </label>
                <div id="form-checkout__expirationDate" class="mp-input" style="min-height: 48px;">
                  <div class="mp-loading" style="padding: var(--spacing-3); color: var(--text-tertiary);">Carregando...</div>
                </div>
              </div>
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">
                  CVV *
                  <span id="cvvHint" style="font-weight: normal; color: #2196F3; font-size: var(--text-sm); display: none;">
                    (Teste: 123)
                  </span>
                </label>
                <div id="form-checkout__securityCode" class="mp-input" style="min-height: 48px;">
                  <div class="mp-loading" style="padding: var(--spacing-3); color: var(--text-tertiary);">Carregando...</div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: var(--spacing-5);">
              <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Nome no Cartão *</label>
              <input type="text" id="form-checkout__cardholderName" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md);" placeholder="Como está escrito no cartão" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); margin-bottom: var(--spacing-5);">
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">CPF do Titular *</label>
                <input type="text" id="form-checkout__identificationNumber" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md);" placeholder="000.000.000-00" maxlength="14" required>
              </div>
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Email do Titular *</label>
                <input type="email" id="form-checkout__cardholderEmail" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md);" placeholder="email@exemplo.com" required>
              </div>
            </div>

            <input type="hidden" id="form-checkout__identificationType" value="CPF">
            <input type="hidden" id="form-checkout__installments" value="1">

            <div id="cardPaymentError" class="alert alert-error" style="display: none; margin-bottom: var(--spacing-5);"></div>

            <button type="submit" id="cardPaymentBtn" class="btn btn-primary btn-large" style="width: 100%; margin-bottom: var(--spacing-4);">
              Pagar à Vista - R$ ${(this.agendamentoData.preco / 100).toFixed(2)}
            </button>

            <div style="margin-top: var(--spacing-4); padding-top: var(--spacing-4); border-top: 1px solid var(--border-light); text-align: center;">
              <p style="margin-bottom: var(--spacing-3); color: var(--text-tertiary); font-size: var(--text-sm);">
                🧪 Modo de Teste
              </p>
              <button type="button" id="simulateCardApprovedBtn" class="btn btn-secondary" style="width: 100%;">
                ✅ Simular Pagamento Aprovado
              </button>
            </div>
          </form>
        </div>

        <div style="text-align: center; margin-top: var(--spacing-6);">
          <img src="https://imgmp.mlstatic.com/org-img/banners/br/medios/online/468X60.jpg" alt="Mercado Pago" style="max-width: 100%; height: auto;">
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.setupCardForm();
  }

  setupEventListeners() {
    // Payment method tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const method = e.currentTarget.dataset.method;
        this.switchPaymentMethod(method);
      });
    });

    // PIX payment
    const pixBtn = document.getElementById('generatePixBtn');
    if (pixBtn) {
      pixBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.generatePix();
      });
    }

    // Copy PIX code
    const copyBtn = document.getElementById('copyPixBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.copyPixCode();
      });
    }

    // CPF mask for card holder
    const cpfInput = document.getElementById('form-checkout__identificationNumber');
    if (cpfInput) {
      cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 9) {
          value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
          value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
          value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        }

        e.target.value = value;
      });
    }

    // Auto-fill test data button
    const autoFillBtn = document.getElementById('autoFillTestData');
    if (autoFillBtn) {
      autoFillBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoFillTestData();
      });
    }

    // Simulate PIX approved button
    const simulatePixBtn = document.getElementById('simulatePixApprovedBtn');
    if (simulatePixBtn) {
      simulatePixBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulatePaymentApproved();
      });
    }

    // Simulate Card approved button
    const simulateCardBtn = document.getElementById('simulateCardApprovedBtn');
    if (simulateCardBtn) {
      simulateCardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.simulatePaymentApproved();
      });
    }
  }

  simulatePaymentApproved() {
    // Simulate approved payment and go directly to success screen
    console.log('🧪 Simulando pagamento aprovado...');
    this.showPaymentSuccess();
  }

  autoFillTestData() {
    // Fill fields that we can access (non-iframe fields)
    const nameInput = document.getElementById('form-checkout__cardholderName');
    const cpfInput = document.getElementById('form-checkout__identificationNumber');
    const emailInput = document.getElementById('form-checkout__cardholderEmail');

    if (nameInput) nameInput.value = 'APRO';
    if (cpfInput) cpfInput.value = '123.456.789-09';
    if (emailInput) emailInput.value = 'test@test.com';

    // Show hints for iframe fields (that we can't fill programmatically)
    const cardNumberHint = document.getElementById('cardNumberHint');
    const expiryHint = document.getElementById('expiryHint');
    const cvvHint = document.getElementById('cvvHint');

    if (cardNumberHint) cardNumberHint.style.display = 'inline';
    if (expiryHint) expiryHint.style.display = 'inline';
    if (cvvHint) cvvHint.style.display = 'inline';

    // Show success message
    const btn = document.getElementById('autoFillTestData');
    const originalText = btn.textContent;
    btn.textContent = '✅ Dados preenchidos! Preencha o cartão manualmente';
    btn.style.background = '#4CAF50';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '#2196F3';
    }, 3000);
  }

  async setupCardForm() {
    try {
      console.log('Iniciando setup do formulário de cartão...');

      // Ensure MP SDK is ready
      if (!this.mp) {
        console.error('MP SDK não inicializado');
        throw new Error('SDK do Mercado Pago não está pronto');
      }

      // Create card form using Mercado Pago SDK
      this.cardForm = await this.mp.cardForm({
        amount: (this.agendamentoData.preco / 100).toString(),
        iframe: true,
        form: {
          id: 'cardPaymentForm',
          cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: '0000 0000 0000 0000',
          },
          expirationDate: {
            id: 'form-checkout__expirationDate',
            placeholder: 'MM/AA',
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: '123',
          },
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Nome como está no cartão',
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'email@exemplo.com',
          },
          identificationType: {
            id: 'form-checkout__identificationType',
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: '000.000.000-00',
          },
          installments: {
            id: 'form-checkout__installments',
          },
        },
        callbacks: {
          onFormMounted: error => {
            if (error) {
              console.error('Erro ao montar formulário:', error);
              return;
            }
            console.log('✅ Formulário de cartão montado com sucesso');

            // Remove loading messages when form is mounted
            setTimeout(() => {
              const loadingElements = document.querySelectorAll('.mp-loading');
              loadingElements.forEach(el => el.remove());
            }, 100);
          },
          onSubmit: event => {
            event.preventDefault();
            const cardFormData = this.cardForm.getCardFormData();
            console.log('Card form data before processing:', cardFormData);
            this.processCardPayment(cardFormData);
          },
        },
      });

      console.log('✅ CardForm criado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao configurar formulário de cartão:', error);

      // Remove loading messages on error
      const loadingElements = document.querySelectorAll('.mp-loading');
      loadingElements.forEach(el => {
        el.innerHTML = '<span style="color: red;">Erro ao carregar formulário. Recarregue a página.</span>';
      });
    }
  }

  switchPaymentMethod(method) {
    // Update tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
      if (tab.dataset.method === method) {
        tab.classList.add('active');
        tab.style.background = 'var(--brand-primary)';
        tab.style.color = 'white';
        tab.style.borderColor = 'var(--brand-primary)';
      } else {
        tab.classList.remove('active');
        tab.style.background = 'white';
        tab.style.color = 'var(--text-primary)';
        tab.style.borderColor = 'var(--border-medium)';
      }
    });

    // Show/hide payment sections
    document.getElementById('pixPayment').style.display = method === 'pix' ? 'block' : 'none';
    document.getElementById('cardPayment').style.display = method === 'card' ? 'block' : 'none';
  }

  async generatePix() {
    const btn = document.getElementById('generatePixBtn');
    btn.disabled = true;
    btn.textContent = 'Gerando QR Code...';

    try {
      const response = await api.post('/payment/pix', {
        transaction_amount: this.agendamentoData.preco / 100,
        description: `Vistoria ${this.getTipoVistoriaLabel(this.agendamentoData.tipo_vistoria)} - ${this.agendamentoData.protocolo}`,
        payer_email: this.agendamentoData.cliente_email,
        payer_first_name: this.agendamentoData.cliente_nome.split(' ')[0],
        payer_last_name: this.agendamentoData.cliente_nome.split(' ').slice(1).join(' ') || 'Silva',
        payer_identification_type: 'CPF',
        payer_identification_number: this.agendamentoData.cliente_cpf.replace(/\D/g, ''),
        agendamento_id: this.agendamentoData.id
      });

      console.log('PIX Response:', response);

      if (!response.payment_id || !response.qr_code_base64) {
        throw new Error('Resposta inválida do servidor');
      }

      // Show QR Code
      document.getElementById('pixQrCode').style.display = 'block';
      document.getElementById('qrCodeImage').innerHTML = `
        <img src="data:image/png;base64,${response.qr_code_base64}" alt="QR Code PIX" style="max-width: 300px; width: 100%;">
      `;
      document.getElementById('pixCode').value = response.qr_code;

      btn.style.display = 'none';

      // Start polling for payment status
      this.startPaymentPolling(response.payment_id);

    } catch (error) {
      console.error('Error generating PIX:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao gerar QR Code PIX';
      alert(errorMessage + '\nTente novamente.');
      btn.disabled = false;
      btn.textContent = 'Gerar QR Code PIX';
    }
  }

  copyPixCode() {
    const pixCodeInput = document.getElementById('pixCode');
    pixCodeInput.select();
    document.execCommand('copy');

    const btn = document.getElementById('copyPixBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }

  async handleCardPayment(e) {
    e.preventDefault();
    // Prevent default form submission - let Mercado Pago SDK handle it
  }

  async processCardPayment(cardFormData) {
    const btn = document.getElementById('cardPaymentBtn');
    const errorDiv = document.getElementById('cardPaymentError');

    btn.disabled = true;
    btn.textContent = 'Processando pagamento...';
    errorDiv.style.display = 'none';

    try {
      console.log('Card form data received:', cardFormData);

      // Get cardholder data from form
      const cardholderEmail = document.getElementById('form-checkout__cardholderEmail').value;
      const identificationNumber = document.getElementById('form-checkout__identificationNumber').value.replace(/\D/g, '');
      const cardholderName = cardFormData.cardholderName || document.getElementById('form-checkout__cardholderName').value;

      // Split cardholder name
      const nameParts = cardholderName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Silva';

      const paymentData = {
        transaction_amount: this.agendamentoData.preco / 100,
        token: cardFormData.token,
        description: `Vistoria ${this.getTipoVistoriaLabel(this.agendamentoData.tipo_vistoria)} - ${this.agendamentoData.protocolo}`,
        installments: 1, // Always 1 installment
        payment_method_id: cardFormData.payment_method_id,
        payer_email: cardholderEmail,
        payer_first_name: firstName,
        payer_last_name: lastName,
        payer_identification_type: 'CPF',
        payer_identification_number: identificationNumber,
        agendamento_id: this.agendamentoData.id
      };

      console.log('Sending payment data:', paymentData);

      const response = await api.post('/payment/card', paymentData);

      console.log('Payment response:', response);

      if (response.status === 'approved') {
        this.showPaymentSuccess();
      } else if (response.status === 'pending') {
        this.showPaymentPending();
      } else {
        throw new Error(response.status_detail || 'Pagamento não aprovado');
      }

    } catch (error) {
      console.error('Error processing card payment:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao processar pagamento';
      errorDiv.textContent = `${errorMessage}. Verifique os dados do cartão e tente novamente.`;
      errorDiv.style.display = 'block';
      btn.disabled = false;
      btn.textContent = `Pagar à Vista - R$ ${(this.agendamentoData.preco / 100).toFixed(2)}`;
    }
  }

  async startPaymentPolling(paymentId) {
    const checkPayment = async () => {
      try {
        const response = await api.get(`/payment/status/${paymentId}`);

        if (response.status === 'approved') {
          this.showPaymentSuccess();
          return true;
        } else if (response.status === 'rejected' || response.status === 'cancelled') {
          alert('Pagamento não foi aprovado. Tente novamente.');
          location.reload();
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error checking payment:', error);
        return false;
      }
    };

    // Check every 3 seconds for up to 5 minutes
    const maxAttempts = 100;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      const completed = await checkPayment();

      if (completed || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 3000);
  }

  showPaymentSuccess() {
    const container = document.querySelector('.payment-container');
    container.innerHTML = `
      <div style="text-align: center; padding: var(--spacing-12);">
        <div style="font-size: 64px; margin-bottom: var(--spacing-6);">✅</div>
        <h2 style="color: var(--status-success); margin-bottom: var(--spacing-4);">Pagamento Confirmado!</h2>
        <p style="color: var(--text-secondary); margin-bottom: var(--spacing-8);">
          Seu agendamento foi confirmado e o pagamento foi aprovado.
        </p>

        <!-- Dados do Agendamento -->
        <div style="background: var(--bg-secondary); padding: var(--spacing-6); border-radius: var(--radius-lg); margin-bottom: var(--spacing-6); text-align: left;">
          <h3 style="margin-bottom: var(--spacing-4); text-align: center;">📋 Dados do Agendamento</h3>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Protocolo:</strong>
            <span style="color: var(--brand-primary); font-weight: bold; font-size: var(--text-lg);">${this.agendamentoData.protocolo}</span>
          </div>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Tipo de Vistoria:</strong>
            <span>${this.getTipoVistoriaLabel(this.agendamentoData.tipo_vistoria)}</span>
          </div>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Data e Horário:</strong>
            <span>${this.formatDate(this.agendamentoData.data_agendamento)} às ${this.agendamentoData.horario_agendamento}</span>
          </div>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Valor:</strong>
            <span style="color: var(--status-success); font-weight: bold;">R$ ${(this.agendamentoData.preco / 100).toFixed(2)}</span>
          </div>
        </div>

        <!-- Dados do Cliente -->
        <div style="background: var(--bg-secondary); padding: var(--spacing-6); border-radius: var(--radius-lg); margin-bottom: var(--spacing-6); text-align: left;">
          <h3 style="margin-bottom: var(--spacing-4); text-align: center;">👤 Dados do Cliente</h3>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Nome:</strong>
            <span>${this.agendamentoData.cliente_nome}</span>
          </div>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Email:</strong>
            <span>${this.agendamentoData.cliente_email}</span>
          </div>

          <div style="margin-bottom: var(--spacing-3);">
            <strong style="color: var(--text-tertiary);">Telefone:</strong>
            <span>${this.agendamentoData.cliente_telefone}</span>
          </div>

          ${this.agendamentoData.veiculo_placa ? `
          <div style="margin-top: var(--spacing-4); padding-top: var(--spacing-4); border-top: 1px solid var(--border-light);">
            <h4 style="margin-bottom: var(--spacing-3); font-size: var(--text-base);">🚗 Veículo</h4>
            <div style="margin-bottom: var(--spacing-2);">
              <strong style="color: var(--text-tertiary);">Placa:</strong>
              <span>${this.agendamentoData.veiculo_placa}</span>
            </div>
            ${this.agendamentoData.veiculo_modelo ? `
            <div style="margin-bottom: var(--spacing-2);">
              <strong style="color: var(--text-tertiary);">Modelo:</strong>
              <span>${this.agendamentoData.veiculo_modelo}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}
        </div>

        <!-- Botões de Ação -->
        <div style="display: flex; gap: var(--spacing-3); justify-content: center; flex-wrap: wrap;">
          <a href="https://wa.me/5567999673464?text=Olá! Acabei de realizar o pagamento. Protocolo: ${this.agendamentoData.protocolo}" class="btn btn-success" target="_blank">
            💬 Confirmar pelo WhatsApp
          </a>
          <button onclick="window.print()" class="btn btn-secondary">
            🖨️ Imprimir Comprovante
          </button>
          <button onclick="location.reload()" class="btn btn-secondary">
            🔄 Novo Agendamento
          </button>
        </div>
      </div>
    `;
  }

  showPaymentPending() {
    alert('Pagamento pendente. Aguardando confirmação do banco.');
  }

  getTipoVistoriaLabel(tipo) {
    const labels = {
      'cautelar': 'Vistoria Cautelar',
      'transferencia': 'Vistoria de Transferência',
      'outros': 'Outros Serviços'
    };
    return labels[tipo] || tipo;
  }

  formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  }
}
