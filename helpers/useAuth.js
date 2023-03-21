import axios from "axios";

const server = "http://localhost:3000/api";

export const createUser = async (cred) => {
  try {
    console.log("cred", cred);
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
export const addProduct = async (data) => {
  try {
    console.log("data", data);
    const res = await axios.post(`${server}/products`, data, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
export const getProducts = async () => {
  try {
    const res = await axios.get(`${server}/products`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
export const updateProduct = async (id, data) => {
  try {
    const res = await axios.patch(`${server}/products/${id}`, data, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
export const deleteProducts = async (id) => {
  try {
    const res = await axios.delete(`${server}/products/${id}`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
