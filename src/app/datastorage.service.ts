import { Injectable, Type } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  'rxjs/Rx';
import { country_list } from './select/countries';
import { DataScheme } from './select/datascheme.interface';

@Injectable({
  providedIn: 'root'
})
export class DatastorageService{
  private datasource=null;
  private data;
    constructor(private http:Http) {  }

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
 
}