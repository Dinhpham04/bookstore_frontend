import axios from "../axios"

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}

const getAllUsers = (inputId) => {
    // get data from server through api 
    return axios.get(`/api/get-all-users`, {
        params: {
            id: inputId
        }
    })
}

const createNewUserService = (data) => {
    // push data to server through api 
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data:
        {
            id: userId
        }
    }
    );
}

export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService
}
