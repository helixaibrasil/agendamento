import api from '../services/api.js';

export class PaymentForm {
  constructor(agendamentoData) {
    this.agendamentoData = agendamentoData;
    this.mp = null;
    this.publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
    this.init();
  }

  async init() {
    // Initialize Mercado Pago SDK
    this.mp = new MercadoPago(this.publicKey, {
      locale: 'pt-BR'
    });
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

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
            <button id="generatePixBtn" class="btn btn-primary btn-large" style="width: 100%; max-width: 400px;">
              Gerar QR Code PIX
            </button>
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
          <!-- Test Card Info -->
          <div style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: var(--spacing-4); margin-bottom: var(--spacing-6); border-radius: var(--radius-md);">
            <h4 style="margin: 0 0 var(--spacing-3) 0; color: #1976D2; font-size: var(--text-base);">🧪 Dados de Teste - Mercado Pago</h4>
            <div style="font-size: var(--text-sm); color: #424242; line-height: 1.6;">
              <p style="margin: 0 0 var(--spacing-2) 0;"><strong>Cartão:</strong> 5031 4332 1540 6351</p>
              <p style="margin: 0 0 var(--spacing-2) 0;"><strong>Validade:</strong> 11/30</p>
              <p style="margin: 0 0 var(--spacing-2) 0;"><strong>CVV:</strong> 123</p>
              <p style="margin: 0 0 var(--spacing-2) 0;"><strong>Nome:</strong> APRO</p>
              <p style="margin: 0;"><strong>CPF:</strong> 12345678909</p>
            </div>
          </div>

          <form id="cardPaymentForm">
            <div style="margin-bottom: var(--spacing-5);">
              <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Número do Cartão</label>
              <div id="form-checkout__cardNumber" class="mp-input"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); margin-bottom: var(--spacing-5);">
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Vencimento</label>
                <div id="form-checkout__expirationDate" class="mp-input"></div>
              </div>
              <div>
                <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">CVV</label>
                <div id="form-checkout__securityCode" class="mp-input"></div>
              </div>
            </div>

            <div style="margin-bottom: var(--spacing-5);">
              <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Nome no Cartão</label>
              <input type="text" id="form-checkout__cardholderName" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md);" placeholder="Como está escrito no cartão" required>
            </div>

            <div style="margin-bottom: var(--spacing-5);">
              <label style="display: block; margin-bottom: var(--spacing-2); font-weight: var(--font-medium);">Parcelas</label>
              <select id="form-checkout__installments" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--border-medium); border-radius: var(--radius-md);">
                <option>Carregando parcelas...</option>
              </select>
            </div>

            <div id="cardPaymentError" class="alert alert-error" style="display: none; margin-bottom: var(--spacing-5);"></div>

            <button type="submit" id="cardPaymentBtn" class="btn btn-primary btn-large" style="width: 100%;">
              Pagar com Cartão
            </button>
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
  }

  async setupCardForm() {
    // Create card form using Mercado Pago SDK
    this.cardForm = this.mp.cardForm({
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
        installments: {
          id: 'form-checkout__installments',
          placeholder: 'Parcelas',
        },
      },
      callbacks: {
        onFormMounted: error => {
          if (error) return console.warn('Form mounted handling error: ', error);
          console.log('Card form mounted');
        },
        onSubmit: event => {
          event.preventDefault();
          const cardFormData = this.cardForm.getCardFormData();
          this.processCardPayment(cardFormData);
        },
      },
    });
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

      const response = await api.post('/payment/card', {
        transaction_amount: this.agendamentoData.preco / 100,
        token: cardFormData.token,
        description: `Vistoria ${this.getTipoVistoriaLabel(this.agendamentoData.tipo_vistoria)} - ${this.agendamentoData.protocolo}`,
        installments: cardFormData.installments,
        payment_method_id: cardFormData.payment_method_id,
        payer_email: this.agendamentoData.cliente_email,
        payer_first_name: this.agendamentoData.cliente_nome.split(' ')[0],
        payer_last_name: this.agendamentoData.cliente_nome.split(' ').slice(1).join(' ') || 'Silva',
        payer_identification_type: 'CPF',
        payer_identification_number: this.agendamentoData.cliente_cpf.replace(/\D/g, ''),
        agendamento_id: this.agendamentoData.id
      });

      console.log('Payment response:', response);

      if (response.status === 'approved') {
        this.showPaymentSuccess();
      } else if (response.status === 'pending') {
        this.showPaymentPending();
      } else {
        throw new Error('Pagamento não aprovado');
      }

    } catch (error) {
      console.error('Error processing card payment:', error);
      errorDiv.textContent = 'Erro ao processar pagamento. Verifique os dados do cartão e tente novamente.';
      errorDiv.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Pagar com Cartão';
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
        <div style="background: var(--bg-secondary); padding: var(--spacing-6); border-radius: var(--radius-lg); margin-bottom: var(--spacing-6);">
          <p><strong>Protocolo:</strong> ${this.agendamentoData.protocolo}</p>
          <p><strong>Data:</strong> ${this.formatDate(this.agendamentoData.data_agendamento)} às ${this.agendamentoData.horario_agendamento}</p>
        </div>
        <a href="https://wa.me/5567999673464?text=Olá! Acabei de realizar o pagamento. Protocolo: ${this.agendamentoData.protocolo}" class="btn btn-success" target="_blank">
          Confirmar pelo WhatsApp
        </a>
        <button onclick="location.reload()" class="btn btn-secondary" style="margin-left: var(--spacing-3);">
          Novo Agendamento
        </button>
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
