import { config } from 'package.json';

// this file mocks the web API of the same name by working with the
// hard-coded data given and setTimeout to simulate a server delay
export default class MessageService {
   // this is considered a static method in ES6, notice the lack of the function keyword
   static fetchData() {
      return new Promise(resolve => {
         setTimeout(() => {
            resolve({
              arabic: 'Ahlan wa sahlan',
              burmese: 'Kyo-so-ba-thi',
              chechen: 'marsha dogheela',
              chinese: 'Huanying guanglin',
              danish: 'Velkommen',
              dutch: 'Hartelijk welkom',
              english: 'Welcome',
              esperanto: 'Bonvenu',
              estonian: 'Teretulemast',
              finnish: 'Tervetuloa',
              french: 'Soyez la bienvenue',
              gaelic: 'Failte',
              german: 'Herzlich Willkommen',
              hawaiian: 'Aloha E Komo Mai',
              hebrew: 'Baruch haba',
              indonesian: 'Selamat datang',
              italian: 'Benvenuti',
              japanese: 'Irasshaimase',
              maltese: 'Merhba',
              norwegian: 'Velkommen',
              persian: 'Khosh amadid',
              polish: 'Serdecznie witamy!',
              portuguese: 'Bemvindos',
              russian: "Dobro pozhalovat'",
              slovenian: 'Dobrodosli',
              spanish: 'Bienvenida',
              swedish: 'Va"lkommen',
              tibetan: 'Tashi Delek',
              ukranian: 'Laskavo prosimo',
              urdu: 'Khosh amadid',
              vietnamese: 'Kinh Chao Quy Khach',
              welsh: 'Croeso cynnes'
            });
         }, config.mockDelay);
      });
   }
}
