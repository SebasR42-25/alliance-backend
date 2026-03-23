import { apiClient } from '../api/api.client';

class UserService {
    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file); // El nombre 'file' debe coincidir con el @UploadedFile() del backend

        const response = await apiClient.patch('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export const userService = new UserService();