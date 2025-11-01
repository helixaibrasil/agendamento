const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');

// Initialize Mercado Pago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const payment = new Payment(client);
const preference = new Preference(client);

class PaymentController {
  // Create PIX payment
  static async createPixPayment(req, res) {
    try {
      const {
        transaction_amount,
        description,
        payer_email,
        payer_first_name,
        payer_last_name,
        payer_identification_type,
        payer_identification_number,
        agendamento_id
      } = req.body;

      const paymentData = {
        transaction_amount: Number(transaction_amount),
        description: description || 'Pagamento de Vistoria Veicular',
        payment_method_id: 'pix',
        payer: {
          email: payer_email,
          first_name: payer_first_name,
          last_name: payer_last_name,
          identification: {
            type: payer_identification_type || 'CPF',
            number: payer_identification_number
          }
        },
        metadata: {
          agendamento_id: agendamento_id
        }
      };

      const result = await payment.create({ body: paymentData });

      res.json({
        id: result.id,
        status: result.status,
        qr_code: result.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
        ticket_url: result.point_of_interaction.transaction_data.ticket_url,
        payment_id: result.id
      });

    } catch (error) {
      console.error('Error creating PIX payment:', error);
      res.status(500).json({
        error: 'Erro ao criar pagamento PIX',
        details: error.message
      });
    }
  }

  // Create Card payment
  static async createCardPayment(req, res) {
    try {
      const {
        transaction_amount,
        token,
        description,
        installments,
        payment_method_id,
        payer_email,
        payer_first_name,
        payer_last_name,
        payer_identification_type,
        payer_identification_number,
        agendamento_id
      } = req.body;

      const paymentData = {
        transaction_amount: Number(transaction_amount),
        token: token,
        description: description || 'Pagamento de Vistoria Veicular',
        installments: Number(installments) || 1,
        payment_method_id: payment_method_id,
        payer: {
          email: payer_email,
          first_name: payer_first_name,
          last_name: payer_last_name,
          identification: {
            type: payer_identification_type || 'CPF',
            number: payer_identification_number
          }
        },
        metadata: {
          agendamento_id: agendamento_id
        }
      };

      const result = await payment.create({ body: paymentData });

      res.json({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        payment_id: result.id,
        payment_method_id: result.payment_method_id,
        payment_type_id: result.payment_type_id
      });

    } catch (error) {
      console.error('Error creating card payment:', error);
      res.status(500).json({
        error: 'Erro ao criar pagamento com cartão',
        details: error.message
      });
    }
  }

  // Get payment status
  static async getPaymentStatus(req, res) {
    try {
      const { payment_id } = req.params;

      const result = await payment.get({ id: payment_id });

      res.json({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        payment_method_id: result.payment_method_id,
        payment_type_id: result.payment_type_id,
        transaction_amount: result.transaction_amount,
        date_approved: result.date_approved,
        date_created: result.date_created
      });

    } catch (error) {
      console.error('Error getting payment status:', error);
      res.status(500).json({
        error: 'Erro ao buscar status do pagamento',
        details: error.message
      });
    }
  }

  // Webhook to receive payment notifications
  static async webhook(req, res) {
    try {
      const { type, data } = req.body;

      console.log('Webhook received:', { type, data });

      if (type === 'payment') {
        const paymentId = data.id;

        // Get payment details
        const paymentInfo = await payment.get({ id: paymentId });

        console.log('Payment webhook:', {
          id: paymentInfo.id,
          status: paymentInfo.status,
          metadata: paymentInfo.metadata
        });

        // Here you can update the agendamento status based on payment status
        // For example, if payment is approved, update agendamento to 'confirmado'
        if (paymentInfo.status === 'approved' && paymentInfo.metadata.agendamento_id) {
          // TODO: Update agendamento status in database
          console.log('Payment approved for agendamento:', paymentInfo.metadata.agendamento_id);
        }
      }

      res.status(200).send('OK');

    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Error');
    }
  }

  // Get public key for frontend
  static getPublicKey(req, res) {
    res.json({
      public_key: process.env.MP_PUBLIC_KEY
    });
  }

  // Get installments options
  static async getInstallments(req, res) {
    try {
      const { amount, payment_method_id } = req.query;

      // For now, return basic installment options
      // In production, you should use MP API to get real installment options
      const installments = [];
      const maxInstallments = 12;

      for (let i = 1; i <= maxInstallments; i++) {
        installments.push({
          installments: i,
          installment_amount: (Number(amount) / i).toFixed(2),
          total_amount: Number(amount)
        });
      }

      res.json({ installments });

    } catch (error) {
      console.error('Error getting installments:', error);
      res.status(500).json({
        error: 'Erro ao buscar parcelas',
        details: error.message
      });
    }
  }
}

module.exports = PaymentController;
