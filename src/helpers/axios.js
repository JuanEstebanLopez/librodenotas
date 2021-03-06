import Axios from "axios";

const PROD = true;

const URL = PROD ? "http://54.70.79.170/api/" : "http://127.0.0.1:3000/api/";

const axios = Axios.create({
  baseURL: URL,
});

export default axios;

export { URL as baseURL };