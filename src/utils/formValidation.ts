import { CompanyFormData, FormErrors } from '../types/company';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\\D/g, '');

  if (cleanCNPJ.length !== 14) return false;
  if (/^(\\d)\\1+$/.test(cleanCNPJ)) return false;

  // Validação dos dígitos verificadores do CNPJ
  let sum = 0;
  let weight = 5;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cleanCNPJ[12]) !== digit) return false;

  sum = 0;
  weight = 6;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return parseInt(cleanCNPJ[13]) === digit;
};

export const validateZipCode = (zipCode: string): boolean => {
  const cleanZipCode = zipCode.replace(/\\D/g, '');
  return cleanZipCode.length === 8;
};

export const formatCNPJ = (value: string): string => {
  const cleanValue = value.replace(/\\D/g, '');
  return cleanValue
    .replace(/^(\\d{2})(\\d)/, '$1.$2')
    .replace(/^(\\d{2})\\.(\\d{3})(\\d)/, '$1.$2.$3')
    .replace(/\\.(\\d{3})(\\d)/, '.$1/$2')
    .replace(/(\\d{4})(\\d)/, '$1-$2')
    .substring(0, 18);
};

export const formatZipCode = (value: string): string => {
  const cleanValue = value.replace(/\\D/g, '');
  return cleanValue.replace(/^(\\d{5})(\\d)/, '$1-$2').substring(0, 9);
};

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\\D/g, '');
  return cleanValue
    .replace(/^(\\d{2})(\\d)/, '($1) $2')
    .replace(/(\\d{5})(\\d)/, '$1-$2')
    .substring(0, 15);
};

export const validateCompanyForm = (data: CompanyFormData): FormErrors => {
  const errors: FormErrors = {};

  // Validação dos campos básicos
  if (!data.companyName.trim()) {
    errors.companyName = 'Nome da empresa é obrigatório';
  }

  if (!data.cnpj.trim()) {
    errors.cnpj = 'CNPJ é obrigatório';
  } else if (!validateCNPJ(data.cnpj)) {
    errors.cnpj = 'CNPJ inválido';
  }

  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'E-mail inválido';
  }

  // Validação do endereço
  const addressErrors: any = {};

  if (!data.address.state.trim()) {
    addressErrors.state = 'Estado é obrigatório';
  }

  if (!data.address.city.trim()) {
    addressErrors.city = 'Cidade é obrigatória';
  }

  if (!data.address.zipCode.trim()) {
    addressErrors.zipCode = 'CEP é obrigatório';
  } else if (!validateZipCode(data.address.zipCode)) {
    addressErrors.zipCode = 'CEP inválido';
  }

  if (!data.address.neighborhood.trim()) {
    addressErrors.neighborhood = 'Bairro é obrigatório';
  }

  if (!data.address.street.trim()) {
    addressErrors.street = 'Rua é obrigatória';
  }

  if (Object.keys(addressErrors).length > 0) {
    errors.address = addressErrors;
  }

  return errors;
};
