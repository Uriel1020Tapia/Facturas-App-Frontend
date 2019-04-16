import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor inicia sesion';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();//Inicializamos el objeto Usuario
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      swal('Login', `Hola ${this.authService.usuario.username} ya estas autenticado!`, 'info' );
      this.router.navigate(['/clientes']);
      
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal('Error Login','Username o password vacias','error');
      return;
    }
    this.authService.login(this.usuario).subscribe( response => {
      console.log('Respuesta LoginService',response);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;//llamamos al metodo tipo atributo

      this.router.navigate(['/clientes']);
      swal('Login',`Hola ${usuario.username},has iniciado sesion`,'success');
    },err => {
      if(err.status == 400){
        swal('Error Login','Username o password incorrectas!','error');
      }
    })
  }
}
