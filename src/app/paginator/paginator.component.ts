import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges{

  @Input() paginador: any;

  paginas: number[];

  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit() {  
    this.initPaginator();
   }


  ngOnChanges( changes: SimpleChanges){
    let paginadorActualizado = changes['paginador'];
    
    if(paginadorActualizado.previousValue){
      this.initPaginator();
    }

   }

   private initPaginator(): void {
    if(this.paginador.totalPages > 5){
      //primer argumento en el main es nuestra pagina actual  el valor minimo que podria tener el desde y el segundo argumento es el total dew paginas
      this.desde = Math.min( Math.max(1,this.paginador.number - 4), this.paginador.totalPages - 5);
      //primero minimo entre total de paginas 
      this.hasta = Math.max( Math.min(this.paginador.totalPages, this.paginador.number + 4),6);

      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor , indice)=> indice + this.desde);//map dentro de un arreglo es para modificar los datos
     
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor , indice)=> indice + 1);//map dentro de un arreglo es para modificar los datos
      }
   }
}
