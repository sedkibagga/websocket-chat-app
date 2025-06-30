import axios from "axios";
import type { addUserDto, loginUserDto, logoutUserDto } from "../DataParam/dtos";
import type { addUserResponse, loginUserResponse, usersDataResponse } from "../DataResponse/responses";
import type { ChatMessage } from "../../types/Types";

const BaseUri = "http://localhost:8080/";

const login = async (data: loginUserDto): Promise<loginUserResponse> => {
    try {
        const response = await axios.post(`${BaseUri}loginUser`, data);
        console.log("Login response data:", response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
        const storedUser = localStorage.getItem('userData');
        console.log("User in storage:", storedUser);
        if (!storedUser) {
            throw new Error("User data not found in local storage");
        }
        return response.data;
    } catch (error: any) {
        console.warn(error);
        throw new Error(error.response?.data?.message || "Login failed");
    }
}
//  
// const getCategoriesByUser = async (token: string): Promise<getCategoriesResponse[]> => {
//     try {
//         const res = await axios.get(`${BaseUri}api/v1/client/categories`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,

//             },
//         });
//         return res.data;

//     } catch (error: any) {
//         console.warn('Error creating category:', error);
//         throw new Error(error.response?.data?.message || 'failed to get categories');
//     }
// }

const addUser = async (data: addUserDto): Promise<addUserResponse> => {
    try {
        const response = await axios.post(`${BaseUri}addUser`, data);
        console.log("Add user response data:", response.data);
        return response.data;
    }
    catch (error: any) {
        console.warn(error);
        throw new Error(error.response?.data?.message || "Add user failed");
    }
}

const logoutUser = async (data:logoutUserDto) : Promise<void> => {
    try {
        const response = await axios.post(`${BaseUri}logoutUser`, data);
        console.log("Logout response data:", response.data);
        localStorage.removeItem('userData');
    }
    catch (error: any) {
        console.warn(error);
        throw new Error(error.response?.data?.message || "Logout failed");
    }
} 

const findAllUsers = async () :Promise<usersDataResponse[]> => {
    try {
        const response = await axios.get(`${BaseUri}findAllUsers`);
        console.log("Find all users response data:", response.data);
        return response.data;
    }
    catch (error: any) {
        console.warn(error);
        throw new Error(error.response?.data?.message || "Find all users failed");
    }
}

const findChatMessages = async (senderId: string, recipientId: string): Promise<ChatMessage[]> => {
    try {
        const url = `${BaseUri}messages/${senderId}/${recipientId}`;
        console.log("Fetching messages from URL:", url);  // Add this line
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching chat messages:", error);
        throw error;
    }
}












const apisController = {
    login,
    addUser,
    logoutUser,
    findAllUsers,
    findChatMessages,


};

export default apisController;