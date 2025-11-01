export const validators = {
  cpf(value) {
    const cpf = value.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    // Check for known invalid CPFs
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  },

  email(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  },

  phone(value) {
    const phone = value.replace(/\D/g, '');
    return phone.length === 10 || phone.length === 11;
  },

  placa(value) {
    const re = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i;
    return re.test(value);
  },

  required(value) {
    return value !== null && value !== undefined && value.trim() !== '';
  },

  ano(value) {
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear + 1;
  }
};

export const formatters = {
  cpf(value) {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  phone(value) {
    const phone = value.replace(/\D/g, '');
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  },

  placa(value) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  },

  currency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  }
};

export function applyMask(input, type) {
  let value = input.value;

  switch (type) {
    case 'cpf':
      value = value.replace(/\D/g, '');
      value = value.substring(0, 11);
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      break;

    case 'phone':
      value = value.replace(/\D/g, '');
      value = value.substring(0, 11);
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      break;

    case 'placa':
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 7);
      value = value.replace(/([A-Z]{3})(\d)/, '$1-$2');
      break;
  }

  input.value = value;
}
