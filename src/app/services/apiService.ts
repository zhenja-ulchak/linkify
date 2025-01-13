import axios, { AxiosError, AxiosResponse } from 'axios';
 // Імпортуємо хук для перекладів


class ApiService {
  private static instance: ApiService;
  private baseURL: string;


  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
    axios.defaults.withCredentials = true;

  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }


  public async login<R>(username: string, password: string): Promise<R | Error> {
    try {
      const response: AxiosResponse<R> = await axios.post(`${this.baseURL}user/login`,

        { username, password }
        , {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      return response.data;
    } catch (error) {
      return error as Error
    }
  }

  public async get<T>(endpoint: string, token: string): Promise<T | Error> {

    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`,
        {
          headers: {

            Authorization: `Bearer ${token}`,
          },
          withCredentials: true

        });



      return response.data;
    }
    catch (error) {
      return error as Error
    }
  }


  public async getLong<T>(endpoint: string, token: string, options?: { timeout?: number }): Promise<T | Error> {
    try {
        const controller = new AbortController();
        const timeout = options?.timeout || 300000; // Таймаут за замовчуванням — 30 секунд
        const timer = setTimeout(() => controller.abort(), timeout);

        const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            signal: controller.signal, // Додаємо підтримку AbortController
        });

        clearTimeout(timer); // Очищення таймера після завершення запиту
        return response.data;
    }  catch (error) {
      return error as Error
    }
}


  public async post<T, R>(endpoint: string, data: T, token: string): Promise<R | Error> {
    try {
      const response: AxiosResponse<R> = await axios.post(`${this.baseURL}${endpoint}`, data, {

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

      });

      return response.data;
    } catch (error) {
      return error as Error
    }
  }

  public async put<T, R>(endpoint: string, data: T, token: string): Promise<R | Error> {
    try {
      const response: AxiosResponse<R> = await axios.put(
        `${this.baseURL}${endpoint}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      console.log(response);


      return response.data;
    } catch (error) {
      return error as Error
    }
  }

  public async delete<T>(endpoint: string, token: string): Promise<T | Error> {
    try {
      const response: AxiosResponse<T> = await axios.delete(`${this.baseURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return error as Error
    }
  }

// Якщо ви використовуєте i18next для інтернаціоналізації


public CheckAndShow(error: Error, t: Function) {
  // Використовуємо хук для отримання функції перекладу
  let status = 500;
  let message = t('errors.serverError'); // За замовчуванням повідомлення для серверної помилки
  let variant = 'warning';

  // Створення об'єкта для повернення результату
  let retvalue: { status: number; variant: string; message: string } = {
    status: status,
    variant: variant,
    message: message,
  };

  // Перевірка на 401 помилку (Unauthorized)
  if (error instanceof AxiosError && error.response?.status === 401) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.unauthorized'); // Помилка авторизації
    retvalue.variant = 'warning';
  }

  // Перевірка на 404 помилку (Not Found)
  if (error instanceof AxiosError && error.response?.status === 404) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.notFound'); // Помилка "не знайдено"
    retvalue.variant = 'warning';
  }

  // Перевірка на 403 помилку (Forbidden)
  if (error instanceof AxiosError && error.response?.status === 403) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.forbidden'); // Помилка "заборонено"
    retvalue.variant = 'warning';
  }

  // Перевірка на 500 помилку (Internal Server Error)
  if (error instanceof AxiosError && error.response?.status === 500) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.internalServerError'); // Внутрішня серверна помилка
    retvalue.variant = 'error';
  }

  // Перевірка на 502 помилку (Bad Gateway)
  if (error instanceof AxiosError && error.response?.status === 502) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.badGateway'); // Помилка шлюзу
    retvalue.variant = 'error';
  }

  // Перевірка на 503 помилку (Service Unavailable)
  if (error instanceof AxiosError && error.response?.status === 503) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.serviceUnavailable'); // Служба недоступна
    retvalue.variant = 'error';
  }

  // Перевірка на 504 помилку (Gateway Timeout)
  if (error instanceof AxiosError && error.response?.status === 504) {
    retvalue.status = error.response.status;
    retvalue.message = t('errors.gatewayTimeout'); // Тайм-аут шлюзу
    retvalue.variant = 'error';
  }

  // Можна додати інші перевірки для інших статусів

  return retvalue;
}

  


}
export default ApiService.getInstance();
