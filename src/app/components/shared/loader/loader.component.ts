import { Component } from '@angular/core';
import { LoaderService } from "../../../services/loader.service";
@Component({
  selector: 'loading-app',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent{

  constructor(private loaderService: LoaderService) { }


}
