import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class DBConnector {
  private supabaseClient: SupabaseClient | null = null;
  private isConnected: boolean = false;
  private projectName: string = '';

  constructor() {
    this.validateAndConnect();
  }

  /**
   * Valida as credenciais e estabelece conexão com o Supabase
   */
  private validateAndConnect(): void {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
      const projectName = import.meta.env.VITE_PROJECT_NAME;

      // Validar se as variáveis de ambiente existem
      if (!supabaseUrl || !supabaseKey || !projectName) {
        throw new Error(
          'Credenciais do Supabase não configuradas. Verifique VITE_SUPABASE_URL, VITE_SUPABASE_KEY e VITE_PROJECT_NAME no arquivo .env'
        );
      }

      // Validar formato da URL
      if (!supabaseUrl.startsWith('http')) {
        throw new Error('VITE_SUPABASE_URL deve ser uma URL válida');
      }

      // Guardar nome do projeto
      this.projectName = projectName;

      // Criar cliente Supabase
      this.supabaseClient = createClient(supabaseUrl, supabaseKey);
      this.isConnected = true;

      console.log(`✅ Conexão com Supabase estabelecida com sucesso (Projeto: ${this.projectName})`);
    } catch (error) {
      this.isConnected = false;
      console.error('❌ Erro ao conectar com Supabase:', error);
      throw error;
    }
  }

  /**
   * Retorna o estado da conectividade
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Retorna o nome do projeto
   */
  public getProjectName(): string {
    return this.projectName;
  }

  /**
   * Retorna a instância do cliente Supabase
   */
  public getClient(): SupabaseClient {
    if (!this.supabaseClient || !this.isConnected) {
      throw new Error('Cliente Supabase não está conectado');
    }
    return this.supabaseClient;
  }

  /**
   * Executa uma query SQL no Supabase
   * @param tableName
   * @returns Resultado da query
   */
  public async query(tableName: string): Promise<{ data: object | null; error: object | unknown }> {
    if (!this.supabaseClient || !this.isConnected) {
      throw new Error('Não é possível executar query. Cliente Supabase não está conectado');
    }

    try {
      const { data, error } = await this.supabaseClient
        .from(tableName)
        .select("id");

      if (error) {
        console.error('❌ Erro ao executar query:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro ao executar query:', error);
      return { data: null, error };
    }
  }

  /**
   * Fetches cars data from the database
   * @returns Promise with cars data containing id and name
   */
  public async fetchCars(): Promise<{ data: Array<{ id: number; name: string }> | null; error: object | unknown }> {
    if (!this.supabaseClient || !this.isConnected) {
      throw new Error('Não é possível executar query. Cliente Supabase não está conectado');
    }

    try {
      const { data, error } = await this.supabaseClient
        .from('carros')
        .select('id, name');

      if (error) {
        console.error('❌ Erro ao buscar carros:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro ao buscar carros:', error);
      return { data: null, error };
    }
  }
}