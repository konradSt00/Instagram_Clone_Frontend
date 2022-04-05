import {Comm} from './Comment';
import {User} from './User';

export class Post {
  id: number;
  userName: string;
  commentsList: Array<Comm>;
  likes: number;
  description: string;
  liked: boolean;
  constructor(id: number, likes: number, description: string, commentsList: Array<Comm>, userName: string, liked: boolean) {
    this.userName = userName;
    this.commentsList = commentsList;
    this.likes = likes;
    this.id = id;
    this.description = description;
    this.liked = liked;
  }

}
