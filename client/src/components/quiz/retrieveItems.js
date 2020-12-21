import axios from 'axios';
import { host } from '../../common.js';

function retrieveItems(path) {
    return axios.get(host + `/${path}`)
        .then((response) => {
           return response.data
        })
        .catch((error) => {
            alert(error);
        })
};

export default retrieveItems;