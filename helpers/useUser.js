import axios from "axios";
import { server } from "./api";

export const getUser = async () => {
  try {
    const res = await axios.get(`${server}/products`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const getProductById = async (prodId) => {
  try {
    const res = await axios.get(`${server}/products/${prodId}`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const updateProduct = async (prodId, data) => {
  try {
    const res = await axios.put(`${server}/products/${prodId}`, data, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const deleteProduct = async (prodId) => {
  try {
    const res = await axios.delete(`${server}/products/${prodId}`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};
