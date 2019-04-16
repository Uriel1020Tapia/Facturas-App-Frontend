import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoaderService {
  showLoader = false;

  constructor() {}

  show() {
    this.showLoader = true;
    console.log('show loaderService',this.showLoader)
  }

  hide() {
    this.showLoader = false;
    console.log('hide loaderService',this.showLoader)
  }
}
