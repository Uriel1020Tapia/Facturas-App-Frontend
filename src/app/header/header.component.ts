import { Component, OnInit } from '@angular/core';//importamos el component y el oninit para poder usarlos
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({//este es un decorador 
  selector: 'app-header',//con el que se reconoce el componente 
  templateUrl: './header.component.html',//ruta del componente
  styleUrls: ['./header.component.css']//estilos para el componente en especifico
})
export class HeaderComponent  {//export para que se pueda exportar la clase es un modificador de clase 

  tile: string = 'Angular App';

  constructor(private authService: AuthService, private router: Router) { }
  
  logout():void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal('Saliendo . . . ' , `${username}, se esta cerrando tu sesion`, 'success');
    this.router.navigate(['/login'])
  }
}
