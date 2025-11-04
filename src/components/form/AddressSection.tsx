import React from 'react';
import { CompanyAddress } from '../../types/company';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import { BRAZILIAN_STATES } from '../../constants/brazilianStates';
import { formatZipCode } from '../../utils/formValidation';

interface AddressSectionProps {
  address: CompanyAddress;
  errors?: {
    state?: string;
    city?: string;
    zipCode?: string;
    neighborhood?: string;
    street?: string;
    reference?: string;
  };
  onAddressChange: (field: keyof CompanyAddress, value: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ 
  address, 
  errors, 
  onAddressChange 
}) => {
  const stateOptions = BRAZILIAN_STATES.map(state => ({
    value: state.code,
    label: `${state.name} (${state.code})`
  }));

  return (
    <div className="form-section">
      <h3 className="form-section-title">Endereço da Empresa</h3>
      
      <div className="address-section">
        {/* Primeira linha: Estado, Cidade, CEP */}
        <div className="address-grid-main">
          <FormSelect
            id="address-state"
            label="Estado"
            value={address.state}
            onChange={(value) => onAddressChange('state', value)}
            options={stateOptions}
            error={errors?.state}
            placeholder="Selecione o estado"
            required
          />

          <FormField
            id="address-city"
            label="Cidade"
            value={address.city}
            onChange={(value) => onAddressChange('city', value)}
            error={errors?.city}
            placeholder="Digite a cidade"
            required
          />

          <FormField
            id="address-zipCode"
            label="CEP"
            value={address.zipCode}
            onChange={(value) => onAddressChange('zipCode', value)}
            error={errors?.zipCode}
            placeholder="00000-000"
            formatter={formatZipCode}
            required
          />
        </div>

        {/* Segunda linha: Bairro e Rua */}
        <div className="address-grid-details">
          <FormField
            id="address-neighborhood"
            label="Bairro"
            value={address.neighborhood}
            onChange={(value) => onAddressChange('neighborhood', value)}
            error={errors?.neighborhood}
            placeholder="Digite o bairro"
            required
          />

          <FormField
            id="address-street"
            label="Rua e Número"
            value={address.street}
            onChange={(value) => onAddressChange('street', value)}
            error={errors?.street}
            placeholder="Rua, número e complemento"
            required
          />
        </div>

        {/* Terceira linha: Referência */}
        <FormField
          id="address-reference"
          label="Ponto de Referência"
          value={address.reference}
          onChange={(value) => onAddressChange('reference', value)}
          error={errors?.reference}
          placeholder="Ex: Próximo ao shopping, em frente à praça..."
          helpText="Campo opcional para facilitar a localização"
        />
      </div>
    </div>
  );
};
