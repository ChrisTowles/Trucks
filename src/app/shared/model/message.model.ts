export interface Message {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

export interface MessageId extends Message {
  id: string;
}


