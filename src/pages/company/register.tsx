import React from 'react';
import { CompanyRegistrationForm } from '../../components/CompanyRegistrationForm';
import { CompanyFormData } from '../../types/company';

const CompanyRegisterPage: React.FC = () => {
  const handleCompanySubmit = async (data: CompanyFormData) => {
    try {
      // Aqui você pode implementar a chamada para sua API
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar empresa');
      }

      const result = await response.json();
      console.log('Empresa cadastrada:', result);
      
      // Redirecionar ou mostrar mensagem de sucesso
      alert('Empresa cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar empresa. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CompanyRegistrationForm onSubmit={handleCompanySubmit} />
    </div>
  );
};

export default CompanyRegisterPage;
