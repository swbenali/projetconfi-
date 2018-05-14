import { Component, OnInit } from '@angular/core';
import { country_list } from './select/countries';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  public countries= country_list;
  public datasrc= "https://select-24e95.firebaseio.com/countries.json";
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyDKD1k5BCi5ZJvCGw3WlNHk4PYvXI6zVqU",
      authDomain: "select-24e95.firebaseapp.com",
    });

}
}