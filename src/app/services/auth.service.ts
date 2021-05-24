import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';


//import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;

  constructor(public auth: AngularFireAuth) { }

  mobileLogin(phonenumber: string){
   //this.auth.signInWithPhoneNumber(phonenumber, )
  }


  async getUserProfile(): Promise<firebase.User>{
    this.user = await this.auth.currentUser;
    return this.user;
  }


  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    //return firebase.auth().signInWithEmailAndPassword(email, password);
    return this.auth.signInWithEmailAndPassword(email,password);
  }
  signupUser(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email,password);
  }

  resetPassword(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }
  logoutUser(): Promise<void> {
    return this.auth.signOut();
  }

}
