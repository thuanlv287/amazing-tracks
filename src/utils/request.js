import axios from "axios";
import { isEmpty } from "../common";

const request = async (options) => {
  if (isEmpty(options)) return null;
  let { url, method } = options;
  if (!url) return null;
  if (!method) {
    method = 'GET';
  }
  try {
    const data = await fetch(url, {
      method
    });
    return data.json();
  } catch (error) {
    throw new Error(error);
  }

}

const requestAxios = async (options) => {
  if (isEmpty(options)) return null;
  let { url, method } = options;
  if (!url) return null;
  if (!method) {
    method = 'GET';
  }
  try {
    const data = await axios.get(url);
    return data.data.data.data;
  } catch (error) {
    throw new Error(error);
  }
}

export {
  requestAxios
}
export default request;