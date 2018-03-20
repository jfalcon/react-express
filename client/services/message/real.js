// this file mocks the web API of the same name by working with the
// hard-coded data given and setTimeout to simulate a server delay
export default class MessageService {
   // this is considered a static method in ES6, notice the lack of the function keyword
   static fetchData() {
      return fetch('http://localhost:3000/messages', {
        mode: 'cors'
      }).then(response => response.json());
   }
}
