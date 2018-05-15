/** This component won't show any content. It returns the value inside the selector. */
import { Component, ViewChild, ElementRef, AfterContentInit } from "@angular/core";

@Component({
    selector: "app-option",
    templateUrl: "./option.component.html"
  })
export class OptionComponent implements AfterContentInit {
   @ViewChild('f') f:ElementRef; 
   public data=null;
   constructor(){
   }
 ngAfterContentInit(){

    this.data= this.f.nativeElement.innerHTML;

 }   

}