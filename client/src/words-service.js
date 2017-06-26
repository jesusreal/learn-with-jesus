import {SERVER_URL} from './constants';
import ApiService from './api-service';

export default {
  getAll(step){
    return ApiService.get(`${SERVER_URL}/words`, {step})
  // Once words have created and last modified fields, return new words first
  //     .then((allWords) => {
  //       console.log(allWords);
  //       allWords.sort((a,b) => new Date(b.date) - new Date(a.date)))
  //       });
  },

  add(wordData){
    return ApiService.post(`${SERVER_URL}/word`, wordData)
  },

  remove(wordId){
    return ApiService.remove(`${SERVER_URL}/word`, {wordId})
  },

  update(wordData){
    return ApiService.update(`${SERVER_URL}/word`, wordData)
  }
}
