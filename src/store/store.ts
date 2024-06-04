import { IUser } from "../models/response/IUser";
import {makeAutoObservable} from "mobx"
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import $api, { API_URL } from "../http";
import { useNavigate } from "react-router-dom";


export default class Store {
    user = {} as IUser;
    isAuth = false;
    
    


    constructor(){
        makeAutoObservable(this);
    }

    setAuth(bool:boolean ){
        this.isAuth = bool;
    }

    setUser(user: IUser){
        this.user = user;
    }

    async login(email:string, password:string){
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.user.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (err:any) {
            console.log(err.response?.data?.messages);
        }
    }

    async reg(name:string, email:string, password:string){
        try {
            const response = await AuthService.register(name, email, password);
            localStorage.setItem('token', response.data.user.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (err:any) {
            console.log(err.response?.data?.messages);
        }
    }

    async logout(){
        try {
            if (localStorage.getItem('token')){
                await AuthService.logout();
                localStorage.removeItem('token');
                this.setAuth(false);
                this.setUser({} as IUser);
            }
        } catch (err:any) {
            //console.log(err.response?.data?.messages);
        }
    }

    async checkAuth(){
        try {
            if (localStorage.getItem('token')){
                const response = await axios.get<AuthResponse>( `${API_URL}/user/refresh`, {withCredentials: true})
                //localStorage.setItem('token', response.data.user.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }
        } catch (err:any) {
            this.setAuth(false)
        }
    }
}