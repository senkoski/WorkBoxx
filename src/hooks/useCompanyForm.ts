import { useState, useCallback } from 'react';
import { CompanyFormData, CompanyAddress, FormErrors } from '../types/company';
import { validateCompanyForm } from '../utils/formValidation';

const initialFormData: CompanyFormData = {
  companyName: '',
  cnpj: '',
  email: '',
  phone: '',
  logoUrl: '',
  address: {
    state: '',
    city: '',
    zipCode: '',
    neighborhood: '',
    street: '',
    reference: ''
  }
};

export const useCompanyForm = () => {
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const updateAddressField = useCallback((field: keyof CompanyAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));

    // Limpar erro de endereço quando usuário começar a digitar
    if (errors.address?.[field]) {
      setErrors(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: undefined
        }
      }));
    }
  }, [errors.address]);

  const validateForm = useCallback((): boolean => {
    const validationErrors = validateCompanyForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const submitForm = useCallback(async (onSubmit: (data: CompanyFormData) => Promise<void>) => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateAddressField,
    validateForm,
    resetForm,
    submitForm
  };
};
