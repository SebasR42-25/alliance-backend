import { apiClient } from '../api/api.client';
import { RegisterDto, LoginDto } from '@/types/auth.types';

class AuthService {
    async register(data: RegisterDto) {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    }

    async login(data: LoginDto) {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    }
}

export const authService = new AuthService();