import Api from './API'

export default {

  login (credentials) {
    return Api.post('/login', credentials);
  },

  register(formData){
    return Api.post('/register', formData);
  }
  
}