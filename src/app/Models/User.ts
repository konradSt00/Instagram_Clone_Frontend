import {Post} from './Post';

export class User{
  name: string;
  description: string;
  numOfFollowers: number;
  numOfFollowing: number;
  posts: Array<Post>;
  followings: Array<string>;
  followers: Array<string>;
  constructor(name: string, description: string, numOfFollowers: number, numOfFollowing: number,
              posts: Array<Post>, followings: Array<string>, followers: Array<string>) {
    this.name = name;
    this.description = description;
    this.numOfFollowers = numOfFollowers;
    this.numOfFollowing = numOfFollowing;
    this.posts = posts;
    this.followings = followings;
    this.followers = followers;
  }
}
