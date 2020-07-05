import axios from 'axios'
let api;
if(process.env.NODE_ENV !== 'production'){
   api = axios.create({
       baseURL: 'http://localhost:3535/'
     })
 
 } else {
   api = axios.create({
     baseURL: 'http://social-media-app-mevn.herokuapp.com'
   })
 }

export default api