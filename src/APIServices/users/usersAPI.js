import { BASE_URL } from "../../utils/baseEndPoint"
import axios from "axios";


//Register User
export const registerAPI = async (userData) => {
    const response = await axios.post(`${BASE_URL}/users/register`, {
        username: userData?.username,
        password: userData?.password,
        email: userData?.email,
    }, {
        withCredentials: true
    }
    );
    return response.data;
}

//Login User
export const loginAPI = async (userData) => {
    const response = await axios.post(`${BASE_URL}/users/login`, {
        username: userData?.username,
        password: userData?.password,
    }, {
        withCredentials: true
    }
    );
    return response.data;
}