import Axios from "axios";

const PROD = false;

const URL = PROD ? "" : "http://127.0.0.1:3000/";

const axios = Axios.create({
  baseURL: URL,
});

export default axios;

export { URL as baseURL };