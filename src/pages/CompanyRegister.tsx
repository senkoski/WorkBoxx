import React from 'react';
import { CompanyRegistrationForm } from '../components/CompanyRegistrationForm';
import { CompanyFormData } from '../types/company';

const CompanyRegisterPage: React.FC = () => {
  const handleCompanySubmit = async (data: CompanyFormData) => {
    try {
      // Implementar chamada para API
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar empresa');
      }

      const result = await response.json();
      console.log('Empresa cadastrada com sucesso:', result);
      
      // Redirecionar ou mostrar mensagem de sucesso
      alert('Empresa cadastrada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      alert('Erro ao cadastrar empresa. Tente novamente.');
      throw error; // Re-throw para que o hook saiba que houve erro
    }
  };

  const handleCancel = () => {
    // Implementar navegação de volta ou limpeza
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CompanyRegistrationForm 
        onSubmit={handleCompanySubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CompanyRegisterPage;
