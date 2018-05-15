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
  Type
} from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { DatastorageService } from "../datastorage.service";
import { OptionComponent } from "./option.component";
import { DataScheme } from "./datascheme.interface";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"]
})
export class SelectComponent implements OnInit , AfterViewInit{
  @Input() public isMulti: boolean = false;
  @Input() public data= null;
  @Input() public min: number = -1;
  @Input() public max: number = -1;
  @Input() public guide: boolean = false;
  @Input() public isRequired: boolean = false;
  @Input() dataSource: string = null;
  @Input() dataScheme:DataScheme;
  public isOpen: boolean = false;
  public selectedItems: { value: string; ref }[] = [];
  public inputfield = "";
  public searchInput = "";
  public isError = false;
  public isClicked = false;
  public options:OptionComponent[];
  @ContentChildren(OptionComponent) optionComponent:QueryList<OptionComponent>;
  itemsOverFull = false;
  constructor(private ds: DatastorageService) {}

  ngOnInit() {
    
    if (this.dataSource != null) {
      this.ds.setDataSource(this.dataSource);
      this.ds.getData(this.dataScheme).subscribe((res: string[]) => (this.data = res));
    }

    
  }

  menuClicked(event: Event) {
    this.isClicked = true;
    if (event.srcElement.localName !== "a") this.isOpen = !this.isOpen;
  }
  setWarn() {
    this.showWarning();
    new Audio(
      "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
    ).play();
  }

  showWarning() {
    // console.log('overclick');
    this.itemsOverFull = true;

    setTimeout(() => (this.itemsOverFull = false), 3000);
  }

  onDelete(item: { value: string; ref }, e?: Event) {
    (<Element>item.ref).className = "";
    const index = this.selectedItems.indexOf(item);
    this.selectedItems.splice(index, 1);
  }

  onItemClick(index: number, e?: Event) {
    const item = this.data[index];

    if (e.srcElement.className === "") {
      if (
        this.isMulti &&
        (this.max == -1 ||
          !this.selectedItems ||
          this.selectedItems.length < this.max)
      )
        this.selectedItems
          ? this.selectedItems.push({ value: item, ref: e.srcElement })
          : (this.selectedItems = [{ value: item, ref: e.srcElement }]);
      else if (!this.isMulti)
        this.selectedItems = [{ value: item, ref: e.srcElement }];
      e.srcElement.className = "select";
    } else {
      e.srcElement.className = "";
      this.selectedItems.splice(
        this.selectedItems.findIndex((elt, index: number, value) => {
          return elt.value === item;
        }),
        1
      );
    }

    this.isOpen = this.isMulti || !this.isOpen;
    this.searchInput = "";
  }
  @HostListener("document:click", ["$event"])
  clickAway(e: Event) {
    if (e.srcElement.localName == "html") {
      this.isOpen = false;
    }
    this.doCheck();
  }
  private doCheck() {
    this.isError =
      this.isClicked &&
      this.isRequired &&
      (!this.selectedItems ||
        this.selectedItems.length == 0 ||
        (this.isMulti &&
          this.max != -1 &&
          this.selectedItems.length > this.max) ||
        (this.isMulti &&
          this.min != -1 &&
          this.selectedItems.length < this.min));
  }
  ngAfterViewInit(){
    if(this.optionComponent.length!==0){
    // console.log(this.optionComponent.toArray());
this.options=this.optionComponent.toArray(); 
  if(!this.data) this.data=[];
  for (let item of this.options)
     this.data.push(item.data);
   //  console.log(this.data);
         
    }
    else
  this.options=null;
  }


 
}
