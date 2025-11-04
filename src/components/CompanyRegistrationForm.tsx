import React, { useState } from 'react';
import { Company } from '../types/company';

type CompanyRegistrationFormProps = {
  onSubmit?: (data: Company) => Promise<void>;
  onCancel?: () => void;
};

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Company>({
    id: 0,
    nome_empresa: '',
    cnpj: '',
    email_empresarial: '',
    telefone: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numero: '',
    complemento: '',
    status_ativo: true,
    data_criacao: '',
    data_atualizacao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData({
        id: 0,
        nome_empresa: '',
        cnpj: '',
        email_empresarial: '',
        telefone: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        endereco: '',
        numero: '',
        complemento: '',
        status_ativo: true,
        data_criacao: '',
        data_atualizacao: '',
      });
    } catch (err: any) {
      setErrors({ submit: 'Erro ao cadastrar empresa.' });
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setFormData({
      id: 0,
      nome_empresa: '',
      cnpj: '',
      email_empresarial: '',
      telefone: '',
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numero: '',
      complemento: '',
      status_ativo: true,
      data_criacao: '',
      data_atualizacao: '',
    });
    setErrors({});
  };
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Cadastrar Nova Empresa</h2>
              <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="nome_empresa" className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input type="text" id="nome_empresa" value={formData.nome_empresa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, nome_empresa: e.target.value}))} className="w-full px-3 py-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input type="text" id="cnpj" value={formData.cnpj} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, cnpj: e.target.value}))} className="w-full px-3 py-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="email_empresarial" className="block text-sm font-medium text-gray-700 mb-1">E-mail Empresarial</label>
                <input type="email" id="email_empresarial" value={formData.email_empresarial} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, email_empresarial: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" id="telefone" value={formData.telefone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, telefone: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input type="text" id="cep" value={formData.cep} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, cep: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                <input type="text" id="estado" value={formData.estado} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, estado: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input type="text" id="cidade" value={formData.cidade} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, cidade: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input type="text" id="bairro" value={formData.bairro} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, bairro: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input type="text" id="endereco" value={formData.endereco} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, endereco: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input type="text" id="numero" value={formData.numero} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, numero: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input type="text" id="complemento" value={formData.complemento} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, complemento: e.target.value}))} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="status_ativo" checked={formData.status_ativo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((f: Company) => ({...f, status_ativo: e.target.checked}))} />
                <label htmlFor="status_ativo" className="text-sm font-medium text-gray-700">Empresa Ativa</label>
              </div>
              {/* data_criacao e data_atualizacao são automáticos, não editáveis */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/80">{isSubmitting ? 'Cadastrando...' : 'Cadastrar Empresa'}</button>
              </div>
              {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
            </form>
          </div>
    </div>
  );
};
