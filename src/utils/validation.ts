import { CompanyFormData, FormErrors, Address } from '../types/company';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let weight = 5;
  
  // Primeiro dígito verificador
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cleanCNPJ[12]) !== digit) return false;
  
  // Segundo dígito verificador
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
  const cleanZipCode = zipCode.replace(/\D/g, '');
  return cleanZipCode.length === 8;
};

export const validateCompanyForm = (data: CompanyFormData): FormErrors => {
  const errors: FormErrors = {};

  // Validação dos dados básicos da empresa
  if (!data.companyName.trim()) {
    errors.companyName = 'Nome da empresa é obrigatório';
  }

  if (!data.cnpj.trim()) {
    errors.cnpj = 'CNPJ é obrigatório';
  } else if (!validateCNPJ(data.cnpj)) {
    errors.cnpj = 'CNPJ inválido';
  }

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  // Validação do endereço
  const addressErrors: Partial<Address> = {};

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
