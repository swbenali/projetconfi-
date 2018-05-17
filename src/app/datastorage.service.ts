import { Injectable, Type } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  'rxjs/Rx';
import { country_list } from './select/countries';
import { DataScheme } from './select/datascheme.interface';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class DatastorageService{
  private datasource:string=null;
  private data;
    constructor(private http:Http) { 
    //   let config = {
    //     apiKey: "AIzaSyDKD1k5BCi5ZJvCGw3WlNHk4PYvXI6zVqU",
    //     authDomain: "select-24e95.firebaseapp.com",
    //     databaseURL: "https://select-24e95.firebaseio.com",
    //     projectId: "select-24e95",
    //     storageBucket: "select-24e95.appspot.com",
    //     messagingSenderId: "838321941818"
    //   };
    //   firebase.initializeApp(config);;
    //  
  }

  setDataSource(src:string){
    this.datasource=src;
  }

  getData(callback?:DataScheme):Observable<string[]>{
  return this.http.get(this.datasource)
   .map(
    (response: Response) => {
      const items: string[] = callback?callback(response.json()):response.json();
    
      return items;
    }
  );
  }
  saveData(){
   this.http.put("https://select-24e95.firebaseio.com/countries.json",country_list).subscribe
   (item=>console.log("OK!"));
  }
  fetchData(name:string,itemname?:string){
   const t=[]
   const src = this.datasource.slice(this.datasource.lastIndexOf('/')+1).replace('.json','');
    firebase.database().ref(src).on('value',function(snapshot) {
      // this.authState.prenom = snapshot.val().prenom; <= This is not working because I can't use "this" operator here and don't know why
 //here we can't assign a cloud function so I made the filter offline!
         
          const v= snapshot.val();
          
          if(v)
          for(let item of v){
             const vitem = (itemname)? item[itemname]:item;
            //  console.log(itemname);
             
             if(vitem&& name!=null && name.length>0 &&(<string>vitem).toLowerCase().includes(name.toLowerCase()))
               t.push(<string>vitem);
            }

   
      // this.authState.nom = snapshot.val().nom; <= not working because of the operator "this"
    });
    return t;

    }
}