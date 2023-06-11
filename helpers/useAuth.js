import axios from "axios";
import { server } from "./api";

export const createUser = async (cred) => {
  try {
    const res = await axios.post(`${server}/auth/signup`, cred);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const login = async (cred) => {
  try {
    const res = await axios.post(`${server}/users/login`, cred, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
export const checkAuth = async (cook) => {
  try {
    const res = await axios.get(`${server}/users/protected`, {
      headers: {
        cookie: cook,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const logOut = async () => {
  try {
    const res = await axios.get(`${server}/users/logout`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
