export type loginUserResponse = {
    id: string;
    nickName: string;
    fullName: string;
    email: string;
    status: 'ONLINE' | 'OFFLINE';
}

export type addUserResponse = {
    id: string;
    nickName: string;
    fullName: string;
    email: string;
    status: 'ONLINE' | 'OFFLINE';
}

export type usersDataResponse = {
    id: string;
    nickName: string;
    fullName: string;
    email: string;
    status: 'ONLINE' | 'OFFLINE';
}
