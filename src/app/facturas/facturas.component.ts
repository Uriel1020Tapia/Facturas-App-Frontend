import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }
    

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let clienteId = +params.get('clienteId');//el signo mas es para hacer un casteo a tipo number
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autoCompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombre),
      flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{

      let nuevoItem = new ItemFactura();
      nuevoItem.producto =  producto;
      this.factura.items.push(nuevoItem);//agregar item al array
  
    }

    this.autoCompleteControl.setValue('');//dejar el autocomplete vacio
    event.option.focus();//focus en el autocomplete 
    event.option.deselect();//deseleccionar 

  }

  actualizarCantidad(id: number, event: any): void {
    console.log('event.value ',event.target.value);
    let cantidad: number =  event.target.value as number;

    if( cantidad == 0){

      return this.eliminarItemFactura(id);
    }

    console.log('cantidad ',cantidad);
    
    this.factura.items = this.factura.items.map((item:ItemFactura)=> {
      console.log('item ',item);
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
    console.log('this.factura.items',this.factura.items);
  }
  
  existeItem(id:number):boolean{

    let existe = false;
    this.factura.items.forEach((item: ItemFactura)=>{
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number): void{

    this.factura.items = this.factura.items.map((item:ItemFactura)=> {
      console.log('item ',item);
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }
  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura)=> id !=item.producto.id);
  }

  create(facturaForm): void {
    console.log(this.factura);

    if(this.factura.items.length == 0){
      this.autoCompleteControl.setErrors({'invalid': true});
    }
    if(facturaForm.form.valid && this.factura.items.length > 0 ){

    this.facturaService.create(this.factura).subscribe(factura => {
      console.log(factura.descripcion);
      swal(this.titulo, `Factura  ${this.factura.descripcion} ha sido creada con exito`, 'success');
      this.router.navigate(['/clientes']);
    });
    }
  }
}
