import Api from './API'

export default {

  login (credentials) {
    return Api.post('/login', credentials);
  },

  register(formData){
    return Api.post('/register', formData);
  },

  resetPassword(email){
    return Api.post('/auth/password/reset', email);
  },
  updatePassword(data){
    return Api.post(`/auth/password/update`, data);
  }
  
}