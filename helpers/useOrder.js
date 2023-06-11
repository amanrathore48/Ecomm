import axios from "axios";
import { server } from "./api";

export const createOrder = async (data) => {
  try {
    console.log("data", data);
    const res = await axios.post(`${server}/orders`, data, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const getOrders = async () => {
  try {
    const res = await axios.get(`${server}/orders`, {
      withCredentials: true,
    });
    console.log("res", res.data);
    return res.data.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const getBuyerOrders = async (buyerId) => {
  try {
    const res = await axios.get(`${server}/orders`, {
      withCredentials: true,
      params: {
        buyerId: buyerId,
      },
    });
    console.log("res", res.data);
    return res.data.data;
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export const getOrderById = async (orderId) => {
  try {
    const res = await axios.get(`${server}/orders/${orderId}`, {
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
