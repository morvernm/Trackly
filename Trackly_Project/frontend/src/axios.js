import axios from 'axios';

const apiBaseURL = "http://127.0.0.1:8000/";

// followed Very Academy Django rest tutorial for code below
https://www.youtube.com/watch?v=AfYfvjP1hK8&list=PLOLrQ9Pn6caw0PjVwymNc64NkUNbZlhFw&index=4

const axiosInstance = axios.create({
     apiBaseUrl: this.apiBaseUrl,
     timeout: 5000,
     // headers object with authorization property
     headers: {
         Authorization: localStorage.getItem('access_token')
             ? 'JWT ' + localStorage.getItem('access_token')
             // if we have an access token - authorization = JWT + token
             : null,
         'Content-Type': 'application/json',
         'accept': 'application/json',
    },
    }
);
