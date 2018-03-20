import mongoose from 'mongoose';

class MessageModel extends mongoose.Schema {
  constructor() {
    const model = super({
      language: { type: 'String', required: true },
      message: { type: 'String', required: true }
    });

    model.methods.all = this.all;

    return model;
  }

  all() {
    return [
      new MessageModel('Arabic', 'Ahlan wa sahlan'),
      new MessageModel('Burmese', 'Kyo-so-ba-thi'),
      new MessageModel('Chechen', 'marsha dogheela'),
      new MessageModel('Chinese', 'Huanying guanglin'),
      new MessageModel('Danish', 'Velkommen'),
      new MessageModel('Dutch ', 'Hartelijk welkom'),
      new MessageModel('English ', 'Welcome'),
      new MessageModel('Esperanto ', 'Bonvenu'),
      new MessageModel('Estonian', 'Teretulemast'),
      new MessageModel('Finnish', 'Tervetuloa'),
      new MessageModel('French ', 'Soyez la bienvenue'),
      new MessageModel('Gaelic', 'Failte'),
      new MessageModel('German ', 'Herzlich Willkommen'),
      new MessageModel('Hawaiian', 'Aloha E Komo Mai'),
      new MessageModel('Hebrew', 'Baruch haba'),
      new MessageModel('Indonesian', 'Selamat datang'),
      new MessageModel('Italian', 'Benvenuti'),
      new MessageModel('Japanese', 'Irasshaimase'),
      new MessageModel('Maltese', 'Merhba'),
      new MessageModel('Norwegian', 'Velkommen'),
      new MessageModel('Persian', 'Khosh amadid'),
      new MessageModel('Polish', 'Serdecznie witamy!'),
      new MessageModel('Portuguese', 'Bemvindos'),
      new MessageModel('Russian', "Dobro pozhalovat"),
      new MessageModel('Slovenian', 'Dobrodosli'),
      new MessageModel('Spanish ', 'Bienvenida'),
      new MessageModel('Swedish', 'Va"lkommen'),
      new MessageModel('Tibetan', 'Tashi Delek'),
      new MessageModel('Ukranian', 'Laskavo prosimo'),
      new MessageModel('Urdu', 'Khosh amadid'),
      new MessageModel('Vietnamese', 'Kinh Chao Quy Khach'),
      new MessageModel('Welsh', 'Croeso cynnes')
    ];
  }
}

export default mongoose.model('MessageModel', new MessageModel);
