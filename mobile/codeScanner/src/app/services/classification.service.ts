import { Injectable } from '@angular/core';
import { ItemClassification } from '../class/item-classification';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {

  itemClassification:ItemClassification;
  constructor() { }
  public initializeItem() {
    this.itemClassification=new ItemClassification();
      }
}
