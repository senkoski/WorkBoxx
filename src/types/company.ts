export interface Address {
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  reference: string;
}

export interface Company {
  id_empresa: number;
  nome_empresa: string;
  cnpj: string;
  email_empresarial?: string;
  telefone?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  status_ativo: boolean;
  data_criacao: string; // ou Date
  data_atualizacao: string; // ou Date
}

export interface CompanyAddress {
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  reference: string;
}

