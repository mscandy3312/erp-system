const api = {
  async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error en la petición');
    }

    return response.json();
  },

  // Métodos para el dashboard
  async getDashboardData() {
    return this.fetchApi('/api/dashboard');
  },

  // Métodos para proyectos
  async getProyectos() {
    return this.fetchApi('/api/proyectos');
  },

  async createProyecto(data: any) {
    return this.fetchApi('/api/proyectos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProyecto(id: number, data: any) {
    return this.fetchApi(`/api/proyectos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProyecto(id: number) {
    return this.fetchApi(`/api/proyectos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api; 