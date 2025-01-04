import axios from "axios"
import Swal from "sweetalert2"


// const BASE_URL = 'https://poskina.onrender.com/poskina'
const BASE_URL = 'http://127.0.0.1:8000'

const getToken = () => {
    const itemStr = localStorage.getItem('token');
        if (!itemStr) {
                return null;
        }
        const item = JSON.parse(itemStr);
        const now = new Date()
        if (now.getTime() > item.expiry) {
                localStorage.removeItem('token');
                return null;
        }
        return item.value;
}

const setToken = (token) => {
    const date = new Date();
    const ttl = 24 * 60 * 60 * 1000
    const item = {
        value: token,
        expiry: date.getTime() + ttl
    }
    window.localStorage.setItem('token', JSON.stringify(item));
}

const errorHandler = (error) => {
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Unable to connect to the server. Please check your internet connection and try again."
        });
        return;
    }
    if (error.status === 401) {
        Swal.fire({
            icon: "error",
            title: "Logged out",
            text: "Please log in again to continue"
        }).then((result) => {
            if (result.isConfirmed) {
                // window.location.href = '/signin';
                window.localStorage.removeItem('token')
                window.location.reload();
                return;
            }
        })
    } else {
        const errorMessage = (error.response && 
            error.response.data) || "An unexpected error occured while processing your request"

        Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage
        })
    }
}


class APICalls{
    constructor() {
        this.api = BASE_URL
        this.token = getToken()
    }

    async get (endpoint) {
        if (endpoint === '/admin/logout') {
            endpoint = `/admin/${this.token}/logout`
            window.localStorage.removeItem('token');
        }
        const url = this.api + endpoint;
        const headers = {Authorization: `PetHaven ${this.token}`}

        return new Promise((resolve, reject) => {
            axios.get(url, { headers })
            .then(response => {
                if (endpoint === `/admin/${this.token}/logout`) {
                    this.token = null
                    window.localStorage.removeItem('token');
                }
                resolve(response.data);
            })
            .catch(error => {
                errorHandler(error);
                reject(error);
            });
        });
    }

    sendImage(imageData) {
        const url = this.api + '/upload_image'
        const headers = {Authorization: `PetHaven ${this.token}`,
                        "Content-Type": "multipart/form-data",}

        return new Promise((resolve, reject) => {
            axios.post(url, imageData, { headers })
            .then(response => resolve(response.data))
            .catch(error => {
                errorHandler(error);
                reject(error)
            });
        });
    }

    post (endpoint, data) {
        const url = this.api + endpoint;
        const payload = JSON.stringify(data)
        const headers = {'Content-Type': 'application/json', Authorization: `PetHaven ${this.token}`}

        return new Promise((resolve, reject) => {
            axios.post(url, data=payload, { headers })
            .then(response => {
                if (endpoint === '/admin/login' || endpoint === '/reset_passwd') {
                    let token = response.data.token
                    if (token) {
                        setToken(token)
                        this.token = token
                    } else {
                        console.error('token not found:', response.data)
                    }
                } else if (endpoint === '/admin/logout') {
                    window.localStorage.removeItem('token')
                    this.token = null;
                }
                resolve(response.data);
            })
            .catch(error => {
                errorHandler(error);
                reject(error);
            });
        });
    }

    put (endpoint, data) {
        const url = this.api + endpoint;
        const payload = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json', Authorization: `PetHaven ${this.token}`};

        return new Promise((resolve, reject) => {
            axios.put(url, data=payload, { headers})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                errorHandler(error);
                reject(error);
            })
        });
    }

    delete (endpoint) {
        const url = this.api + endpoint;
        const headers = {'Content-Type': 'application/json', Authorization: `PetHaven ${this.token}`};

        return new Promise((resolve, reject) => {
            axios.delete(url, { headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                errorHandler(error);
                reject(error);
            });
        });
    }

    checkLoggedIn () {
        return (getToken() != null ? true : false);
    }
}

const apiCalls = new APICalls()
export default apiCalls
