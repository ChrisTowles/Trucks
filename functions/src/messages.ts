import * as nodemailer from 'nodemailer';
import {Message} from '../../src/app/shared/model/message.model';

// TODO: Config settings not working
// const gmailAccount = functions.config().gmail;
const transport = {
  service: 'gmail',
  auth: {
    user: 'webmaster@craigmyletrucks.com',
    pass: 'l63tOUIriR24',
  }
};


const mailTransport = nodemailer.createTransport(transport);


export const messageCreateApp = (event) => {

  //const messageId = event.params.messageId;
  const object = event.data.data() as Message;
  const regex = /#([0-9]*)/;
  const equipmentMatches = regex.exec(object.subject);

  let url: string = null;
  if (equipmentMatches.length > 0)
    url = `https://craigmyletrucks.com/inventory/${equipmentMatches[1]}`;

  const mailOptions = {
    from: `${object.firstName} ${object.lastName} <${ object.email }>`,
    to: [
      'patrick@craigmyletrucks.com',
      'joyce@craigmyletrucks.com',
      'randy@craigmyletrucks.com'
    ],
    subject: object.subject,
    text: ((url) ? url + '\n\n' : '') + object.message
  };

  mailTransport.sendMail(mailOptions)
    .then(() => {
      console.log('New message email sent to: ', mailOptions.to);
    });
};
