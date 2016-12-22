import {SERVER_URL} from './constants';
import ApiService from './api-service';

export default {
  getAllForList(list){
    return ApiService.get(`${SERVER_URL}/words`, {list})
  },

  add(wordData){
    return ApiService.post(`${SERVER_URL}/word`, wordData)
  },

  remove(wordId){
    const body = {wordId, action: 'delete'};
    return ApiService.remove(`${SERVER_URL}/word`, body)
  }

  // edit(){},
}
