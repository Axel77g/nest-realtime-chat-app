import axios from 'axios'

export const getAxiosInstance = () => {
    return axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: "application/json"
        }
    })
}