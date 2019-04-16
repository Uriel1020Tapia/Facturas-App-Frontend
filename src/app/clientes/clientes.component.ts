import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

declare var $:any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']

})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;
  
 
  constructor(private clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalService: ModalService) { }


  ngOnInit() {
    
    $(document).ready(function(){
      // Activate tooltip
      $('[data-toggle="tooltip"]').tooltip();
  
    })
    //Observable vigila el cambio
    this.activatedRoute.paramMap.subscribe( params => {//nos ayuda a obserar el page para que cuando cambiemos de pagina se refresque el rango de datos
      
      let page:number = +params.get('page');

      if(!page){
        page = 0;
      }

        this.clienteService.getClientes(page)
        .pipe(
          tap(response =>{
            console.log("ClientesComponent: tap 3");
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
          })
        ).subscribe( response => 
          {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
        });
      }
    );
    this.modalService.notificarUpload.subscribe( cliente => {
      this.clientes = this.clientes.map( clienteOriginal => {
        if( cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  delete(cliente: Cliente): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
          () => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  abrirModal( cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}