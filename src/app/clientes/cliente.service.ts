import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Region} from './region';
import { Observable, of, throwError  } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';


  constructor(private http: HttpClient,private router: Router) { }


  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }
  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      tap( (response:any ) => {//response any es para indicar que sera de cualquier dato
        //let clientes = response as Cliente[];//map permite convertir al tipo json convertimos la respuesta a un listado de client
        console.log("ClienteService: tap 1");
        (response.content as Cliente[] ).forEach( cliente => {///realizamos un casteo de response 
          console.log(cliente.nombre);
        })
      }),
      map( (response : any) =>{
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();///convertimos el nombre en mayusculas
          return cliente;//segundo return para eloperador map del flujo del observable
        });
        return response;
      }),    
      
      tap(response => {
        console.log("ClienteService: tap 2");
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      }) 
    );
  }
  create(cliente: Cliente) : Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {
        console.log("Este es el error :" + e);

        if(e.status == 400){//errores validacion del formulario 
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);//para redirigir al listado de clientes
          console.log(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  update(cliente: Cliente) : Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{//primero se pasa el dato a recibir y despues el tipo de dato 
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();

    formData.append("archivo", archivo);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
       reportProgress: true
    });

    return this.http.request(req);
  }
}
