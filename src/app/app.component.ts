import { Component, OnInit } from '@angular/core';
import { country_list } from './select/countries';
import * as firebase from 'firebase';
import { DataScheme } from './select/datascheme.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  private apply=null;
  public countries= country_list;
  public datasrc2= "https://select-24e95.firebaseio.com/restaurants.json";
  public datasrc= "https://select-24e95.firebaseio.com/countries.json";
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyDKD1k5BCi5ZJvCGw3WlNHk4PYvXI6zVqU",
      authDomain: "select-24e95.firebaseapp.com",
    });

}
setDataScheme2(data:any):string[]{
   let t=[];
   for(let item of data)
      t.push(item.deal);
  return t;
  // return data.filter((item,index,array)=>{return item.startsWith('A')});
}
setDataScheme(data:any):string[]{
    return data;
  // return data.filter((item,index,array)=>{return item.startsWith('A')});
}
}