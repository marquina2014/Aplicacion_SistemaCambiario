/**
 * Cliente HTTP seguro utilizando la API nativa fetch()
 * Cumple con el requerimiento estricto: SIN AXIOS y sobre HTTPS.
 */

const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Valida y normaliza la URL para asegurar uso de HTTPS
 */
const ensureHttps = (url) => {
  if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

/**
 * Realiza una petición HTTP con control de timeout y manejo uniforme de errores
 */
export async function request(url, options = {}) {
  const secureUrl = ensureHttps(url);
  const timeout = options.timeout || DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    signal: controller.signal,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(secureUrl, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // La respuesta no era JSON
      }
      throw new Error(errorMessage);
    }

    // Verificar si la respuesta contiene cuerpo antes de parsear
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`La petición a ${secureUrl} excedió el tiempo límite (${timeout}ms).`);
    }
    throw error;
  }
}

/**
 * Métodos auxiliares para peticiones HTTP
 */
export const httpClient = {
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) =>
    request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options = {}) =>
    request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
};

export default httpClient;
