import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs';
import  'rxjs/Rx';
import { country_list } from './select/countries';

@Injectable({
  providedIn: 'root'
})
export class DatastorageService {
  private datasource=null;
  private data;
  public source:Subject<string>;
  constructor(private http:Http) { 
this.source=new Subject<string>();
this.datasource= "https://select-24e95.firebaseio.com/countries.json";

this.source.subscribe((src)=>{
console.log('called');

});

  }

  getData(){
   this.http.get(this.datasource)
   .map(
    (response: Response) => {
      const items: string[] = response.json();
    
      return items;
    }
  )  
      .subscribe(
    (item:string[])=>{ this.data= item;
  console.log('Recieved'+item);
  
   });
   return this.data;
  }
   storeData(){
  // console.log(this.datasource);
   
    this.http.put(this.datasource,country_list).subscribe(()=>console.log("OK!"));
   }
}
