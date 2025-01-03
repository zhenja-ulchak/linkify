import axios, { AxiosResponse } from 'axios';

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


  public async login<R>(username: string, password: string): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axios.post(`${this.baseURL}user/login`,

        { username, password }
        , {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        

      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }

  public async get<T>(endpoint: string, token: string ): Promise<T> {
    
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`,
        {
          headers: {
           
             Authorization: `Bearer ${token}`,
          },
          withCredentials: true

        });
        console.log(response);
        
       
      return response.data;
    } 
    catch (error) {
      if (error instanceof Error) {
        throw new Error((error as Error).message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }

  public async post<T, R>(endpoint: string, data: T, token: string): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axios.post(`${this.baseURL}${endpoint}`, data, {

        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },

      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error((error as Error).message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }

  public async put<T, R>(endpoint: string, data: T, token: string): Promise<R> {
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
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }

  public async delete<T>(endpoint: string, token: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(`${this.baseURL}${endpoint}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }


}
export default ApiService.getInstance();
