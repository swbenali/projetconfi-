/**
 * This component implements an HTML Select as Dropdown.
 * Inputs are:
 * -isMulti:boolean=[false] => Enable/Disable the multiselection feature.
 * -data:String[] => Items Data.
 * -min,max:number[Optionnal] => Set the minimum and/or maximum number of selected items.
 * -guide:boolean=[false] => Enable search feature.
 * -isRequired:boolean=[false] => Set the selection required.
 * -dataSource: URL of JSON object
 * -dataScheme: Callback function's reference which gets a JSON Object as Input and returns an array of string.
 */

import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  HostListener,
  ContentChild,
  Query,
  QueryList,
  AfterContentInit,
  AfterViewInit,
  AfterViewChecked,
  ContentChildren,
  Type,
  EventEmitter,
  Output,
  HostBinding,
  Renderer
} from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { DatastorageService } from "../datastorage.service";
import { OptionComponent } from "./option.component";
import { DataScheme } from "./datascheme.interface";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
})
export class SelectComponent implements OnInit, AfterViewInit {
  @Input() public isMulti: boolean = false;
  @Input() public data = null;
  @Input() public min: number = -1;
  @Input() public max: number = -1;
  @Input() public guide: boolean = false;
  @Input() public isRequired: boolean = false;
  @Input() public dataSource: string=null;
  @Input() public dataScheme: DataScheme|string;
  @Input() public throwable = false;
  private inputString:string="";
  public isOpen: boolean = false;
  public selectedItems: { value: string; ref }[] = [];
  public inputfield = "";
  public serachInput = "";
  public isError = false;
  public isClicked = false;
  public options: OptionComponent[];
  private parentNode: any;
  private lastFocus;
  public dropDownContentWidth:number;
  public dropDownContentLeft:number;
  public serachInputWidth:number;
  public serachInputLeft:number;
  @Output("selected") selected: Subject<any> = new Subject<any>();
  @ContentChildren(OptionComponent) optionComponent: QueryList<OptionComponent>;
  public itemsOverFull = false;
  public minimumRequired = false;
  constructor(private ds: DatastorageService, private element: ElementRef,private renderer:Renderer) {}

  ngOnInit() {
    if (this.dataSource != null && !this.guide) {
      this.ds.setDataSource(this.dataSource);
      this.ds
        .getData(<DataScheme> this.dataScheme)
        .subscribe((res: string[]) => (this.data = res));
    }
    if(this.dataSource && this.guide){
      this.ds.setDataSource(this.dataSource);
    }
  }

  public menuClicked(event: Event): void {
    this.isClicked = true;
    if (this.lastFocus && this.isOpen) {
      this.lastFocus.focus();
      console.log("onFocus");
    }
    this.isOpen = !this.isOpen;
  }
  public onDelete(item: { value: string; ref }, e?: Event): void {
    (<Element>item.ref).className = "";
    const index = this.selectedItems.indexOf(item);
    this.selectedItems.splice(index, 1);
    this.refreshSelection();
    this.doCheck();
    e.preventDefault();
    e.stopPropagation();
  }

  public onItemClick(index: number, e?: Event): void {
console.log(this.element);


    const item = this.data[index];
    const elt = { value: item, ref: e.srcElement };
    if (this.itemsOverFull && !this.itemIncludes(elt)) {
      e.stopPropagation();
      return;}

    if (this.isMulti) {
      if (
        this.selectedItems &&
        (this.max == -1 || this.selectedItems.length <= this.max)
      ) {
        if (!this.itemIncludes(elt)) this.selectedItems.push(elt);
        else this.selectedItems.splice(this.itemIndex(elt), 1);
      } else
        this.selectedItems = !this.selectedItems ? [elt] : this.selectedItems;
    } else {
      if (!this.isMulti && this.selectedItems.length == 0)
        this.selectedItems = [elt];
      else if (this.itemIncludes(elt)) this.selectedItems = [];
      else this.selectedItems = [elt];
    }

    this.refreshSelection();
    this.serachInput = "";
    this.doCheck();
    if (this.isMulti) {
      e.stopPropagation();
    }
  }
  @HostListener("window:click", ["$event.path"])
  onClickOutside($event: Array<any>) {
    const elementRefInPath = $event.find(node => node === this.parentNode);

    if (!elementRefInPath) {
      this.isOpen = false;
    }
    this.doCheck();
  }

  private doCheck(): void {
    this.isError =
      this.isClicked &&
      !this.isOpen &&
      ((this.isRequired && !this.countSelected()) ||
        (this.isRequired &&
          this.min != -1 &&
          this.max != -1 &&
          this.min > this.max) ||
        (this.isRequired &&
          this.max != -1 &&
          this.countSelected() > this.max) ||
        (this.isRequired && this.min != -1 && this.countSelected() < this.min));
    this.itemsOverFull =
      this.isMulti &&
      this.max != -1 &&
      this.selectedItems &&
      this.selectedItems.length === this.max;
    this.minimumRequired =
      this.isClicked &&
      this.countSelected() > 0 &&
      !this.isOpen &&
      this.min != -1 &&
      this.countSelected() < this.min;
    if (this.throwable)
      switch (true) {
        case this.min != -1 && this.max != -1 && this.min > this.max:
          throw { code: 1, message: "Please verify your min and max values!" };
        case this.isClicked && this.isRequired && !this.countSelected():
          throw { code: 2, message: "No item selected!" };
        case this.max != -1 && this.countSelected() > this.max:
          throw { code: 3, message: "Maximum selected items reached!" };
        case this.min != -1 && this.countSelected() < this.min:
          throw { code: 4, message: "Minimum selected items reached!" };
        case !this.isMulti && this.min != -1 && this.max != 1:
          throw {
            code: 5,
            message:
              "Forbidden to set max value or min value for single selection!"
          };
      }
  }
  ngAfterViewInit() {
    const elt = this.element.nativeElement;
    this.parentNode = elt.parentNode;
    if (this.optionComponent.length !== 0) {
      this.options = this.optionComponent.toArray();
      if (!this.data) this.data = [];
      for (let item of this.options) this.data.push(item.data);
    } else this.options = null;
    const tag= elt.parentElement.querySelector(".tag-container");
    this.dropDownContentWidth = tag.offsetWidth;
    this.dropDownContentLeft = tag.offsetLeft + tag.parentElement.offsetLeft - tag.clientLeft;
    this.serachInputWidth = tag.offsetWidth;
    this.serachInputLeft = tag.offsetLeft + tag.parentElement.offsetLeft - tag.clientLeft;
  }

  private refreshSelection(): void {
    const v = [];
    if (!this.isMulti)
      this.selected.next(
        this.selectedItems && this.selectedItems.length == 1
          ? this.selectedItems[0].value
          : ""
      );
    else {
      for (let item of this.selectedItems) v.push(item.value);
      this.selected.next(v);
    }
  }

  public itemIncludes(item): boolean {
    return this.itemIndex(item)!= -1;
  }
  public eltIncludes(item: string): boolean {
    return (
      this.selectedItems.findIndex((elt, index, ref) => {
        return item === elt.value;
      }) != -1
    );
  }
  public itemIndex(item):number{
    return this.selectedItems.findIndex((elt, index, ref) => {
      return item.value === elt.value;
    });
    
  }

  public onSearchClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }
  public countSelected(): number {
    return this.selectedItems ? this.selectedItems.length : 0;
  }
  public onInput(event:Event){
    
    if(this.dataSource && this.guide){
   const c= this.serachInput;   
     this.data=this.ds.fetchData(c,this.dataScheme? <string> this.dataScheme:null);

    }
  }

  @HostListener('window:resize',['$event']) onResize(event){
    const elt = this.element.nativeElement;
  const tag= elt.parentElement.querySelector(".tag-container");
    this.dropDownContentWidth = tag.offsetWidth;
    this.dropDownContentLeft = tag.offsetLeft + tag.parentElement.offsetLeft - tag.clientLeft;
    
    this.serachInputWidth = tag.offsetWidth;
    this.serachInputLeft = tag.offsetLeft + tag.parentElement.offsetLeft - tag.clientLeft;
    
   

  }
 

}
