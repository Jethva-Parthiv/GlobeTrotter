import client from './client'

export const uploadApi = {
  /**
   * Upload an image file to the backend
   * @param {File} file
   * @param {'covers' | 'avatars' | 'general'} folder
   * @returns {Promise<{ url: string, filename: string, content_type: string }>}
   */
  uploadImage: async (file, folder = 'covers') => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await client.post('/api/upload/image', formData, {
      params: { folder },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
