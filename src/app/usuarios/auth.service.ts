import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario):Observable<any>{

    const urlEndpoint = 'http://localhost:8080/oauth/token';

    const credenciales = btoa('AppCrud7' + ':' + '12345');//cliente id de la app  mas clave secreta encriptada a base 64

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();//objeto variable local y parametros que vamos a pasar 

    params.set('grant_type','password');     //nombre ,valor
    params.set('username', usuario.username);//nombre ,valor
    params.set('password', usuario.password);//nombre ,valor
  
    console.log('Parametros:' + params.toString());
    return this.http.post<any>(urlEndpoint, params.toString() , { headers: httpHeaders });//convertimos los parametros al tipo string
  }

  guardarUsuario(accesToken: string):void{
    let payload = this.obtenerDatosToken(accesToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }
  guardarToken(accessToken: string):void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }
  obtenerDatosToken(accessToken: string):any{
    if(accessToken != null){
      return  JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  hasRole(role:string): boolean{
    if(this.usuario.roles.includes(role)){//el metodo getter usuario tiene roles array y le preguntamos con el metodo includes
      return true;
    }
    return false;
  }
  
  logout():void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }
}
