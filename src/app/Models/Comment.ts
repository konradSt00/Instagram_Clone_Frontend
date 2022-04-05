import {User} from './User';

export class Comm {
  text: string;
  userName: string;
  date: Date;
  id: number;

  constructor(id: number, text: string, userName: string, date: Date) {
    this.id = id;
    this.text = text;
    this.userName = userName;
    this.date = date;
  }
}
