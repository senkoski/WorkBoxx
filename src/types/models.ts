// Types gerados para refletir o novo banco de dados

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
  data_criacao: string;
  data_atualizacao: string;
}

export interface Departamento {
  id_departamento: number;
  id_empresa: number;
  nome_departamento: string;
  descricao?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  status_ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Usuario {
  id_usuario: number;
  id_empresa: number;
  id_cargo?: number;
  id_permissao: number;
  nome: string;
  email: string;
  senha_usuario: string;
  telefone?: string;
  status_ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
  ultimo_login?: string;
}

export interface Permissao {
  id_permissao: number;
  nome_permissao: string;
  descricao?: string;
  nivel_acesso: number;
  pode_gerenciar_usuarios: boolean;
  pode_gerenciar_empresas: boolean;
  pode_gerenciar_patrimonio: boolean;
  pode_gerenciar_estoque: boolean;
  pode_gerenciar_fiscal: boolean;
  pode_gerar_relatorios: boolean;
  data_criacao: string;
}

export interface Cargo {
  id_cargo: number;
  id_empresa: number;
  id_departamento: number;
  nome_cargo: string;
  descricao?: string;
  departamento?: string;
  nivel_hierarquico: number;
  status_ativo: boolean;
  data_criacao: string;
}

export interface CategoriaProduto {
  id_categoria: number;
  id_empresa: number;
  nome_categoria: string;
  descricao?: string;
  tipo_categoria: 'Patrimonio' | 'Estoque' | 'Consumo';
  vida_util_meses?: number;
  taxa_depreciacao?: number;
  status_ativo: boolean;
  data_criacao: string;
}

export interface BemPatrimonial {
  id_bem: number;
  id_empresa: number;
  id_departamento?: number;
  id_categoria?: number;
  descricao: string;
  numero_serie?: string;
  localizacao_atual?: string;
  status: 'em_uso' | 'em_manutencao' | 'disponivel' | 'descartado' | 'baixado';
  observacoes?: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface MovimentacaoBem {
  id_movimentacao: number;
  id_bem: number;
  id_usuario: number;
  tipo_movimentacao: 'Transferencia' | 'Manutencao' | 'Descarte' | 'Uso' | 'Inventario';
  data_movimentacao: string;
  observacoes?: string;
  comprovante?: string;
  status_movimentacao: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface ProdutoEstoque {
  id_produto: number;
  id_empresa: number;
  id_categoria?: number;
  codigo: string;
  descricao: string;
  quantidade_estoque: number;
  estoque_minimo: number;
  estoque_maximo?: number;
  valor?: number;
  observacoes?: string;
  status_ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export interface MovimentacaoEstoque {
  id_mov_estoque: number;
  id_produto: number;
  id_usuario: number;
  id_departamento?: number;
  tipo_mov: 'Entrada' | 'Saida' | 'Ajuste' | 'Transferencia';
  quantidade: number;
  data_mov: string;
  motivo?: string;
  comprovante?: string;
  observacoes?: string;
  saldo_anterior?: number;
  saldo_atual?: number;
}

export interface NotaFiscal {
  id_nf: number;
  id_empresa: number;
  numero_nf: string;
  serie?: string;
  tipo_nf: 'NF-e' | 'NFC-e' | 'CT-e';
  valor_total: number;
  xml?: string;
  observacoes?: string;
  fornecedor_cnpj?: string;
  fornecedor_nome?: string;
  data_criacao: string;
  data_atualizacao?: string;
}

export interface Ticket {
  id_ticket: number;
  id_empresa: number;
  id_usuario_solicitante: number;
  id_setor_solicitante?: number;
  tipo_ticket: 'estoque' | 'manutencao' | 'transferencia' | 'outros';
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status_ticket: 'aberto' | 'em_andamento' | 'aguardando' | 'concluido' | 'cancelado';
  data_abertura: string;
  data_limite?: string;
  data_conclusao?: string;
  id_usuario_responsavel?: number;
  observacoes_resolucao?: string;
}

export interface Relatorio {
  id_relatorio: number;
  id_empresa: number;
  id_usuario_gerador: number;
  tipo_relatorio: string;
  nome_relatorio: string;
  parametros?: any;
  arquivo_path?: string;
  data_geracao: string;
  status_geracao: 'pendente' | 'processando' | 'concluido' | 'erro';
}

export interface LogAuditoria {
  id_log: number;
  id_empresa: number;
  id_usuario?: number;
  modulo: string;
  acao: string;
  descricao?: string;
  ip_address?: string;
  user_agent?: string;
  data_hora: string;
  dados_anteriores?: any;
  dados_novos?: any;
}

export interface DepreciacaoBem {
  id_depreciacao: number;
  id_bem: number;
  mes_ano_referencia: string;
  valor_depreciacao_mes: number;
  valor_acumulado: number;
  valor_contabil: number;
  data_calculo: string;
}
