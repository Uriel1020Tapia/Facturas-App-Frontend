import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';

import { ClienteService } from './clientes/cliente.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import para formato de  fechas  en forma global para toda la app
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from './components/shared/loader/loader.component';


import { httpInterceptorProviders } from "./usuarios/interceptors/index.Interceptors";

registerLocaleData(localeMX, 'mx');

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full'},
  { path: 'clientes', component: ClientesComponent},
  { path: 'clientes/page/:page', component: ClientesComponent},
  { path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'login', component: LoginComponent },
  { path: 'facturas/:id', component: DetalleFacturaComponent , canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'facturas/form/:clienteId', component: FacturasComponent , canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [//aqui hacemos las declaraciones de cada componente a utilizar en la app
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    NotFoundComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    LoaderComponent
  ],
  imports: [ //aqui van las importaciones de cada componente a utilizar
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule, MatMomentDateModule, MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule, MatInputModule, MatFormFieldModule
  ],
  providers: [ClienteService,
  { provide: LOCALE_ID, useValue: 'mx'},//locale id es para poder cambiar el idioma a nuestra fecha desde la plantilla
  httpInterceptorProviders],//Provaider para validar error 401 y 403
  bootstrap: [AppComponent]
})
export class AppModule { }
