import { Producto } from './producto';

export class ItemFactura {

    producto: Producto;
    cantidad: number = 1;
    importe: number;

    public calcularImporte(): number{//se puede utilizar este metodo aunque ya viene en el json del backen
        return this.cantidad * this.producto.precio;
    }
}
