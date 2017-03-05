import {SERVER_URL} from './constants';
import ApiService from './api-service';

export default {
  getAll(step){
    return ApiService.get(`${SERVER_URL}/words`, {step})
  },

  add(wordData){
    return ApiService.post(`${SERVER_URL}/word`, wordData)
  },

  remove(wordId){
    return ApiService.remove(`${SERVER_URL}/word`, {wordId})
  }

  // edit(){},
}
