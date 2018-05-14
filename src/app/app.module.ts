import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SelectComponent } from './select/select.component';
import { FilterPipe } from './select/filter.pipe';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
     FormsModule,
     HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
