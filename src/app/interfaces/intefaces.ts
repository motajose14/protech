export interface IRespLogin {
    result: boolean;
    cliente?: IClienteLogin[];
    custodio?: ICustodioLogin[];
}

export interface IClienteLogin {
    id: number;
    id_cliente: string;
    razon_social: string;
    fecha_alta: string;
    siglas: string;
    responsable: string;
    estado: string;
    localidad: string;
    direccion: string;
    cp: string ;
    telefono: string;
    correo: string;
    status: string;
    pass: string;
    servicio: IServicesCliente[];
}

export interface IServicesCliente {
    id: number;
    descripcion: string;
    status: string;
    custodio: ICustodioServices[];
}

export interface ICustodioServices {
    id: number;
    cod_elemento: string;
    nombre: string;
    ape_pat: string;
    ape_mat: string;
    sexo: string;
    telefono: string;
    puesto: string;
}

export interface IRespApi {
    result: boolean;
    id_incidencia?: number;
    id_revista?: number;
    id_recorrido?: number;
    id_detalle_recorrido?: number;
}

export interface ICustodioLogin {
    ape_mat?: string;
    ape_pat?: string;
    cod_elemento?: string;
    id?: number;
    id_servicio?: number;
    nombre?: string;
    pass?: string;
    puesto?: string;
    servicio?: string;
    sexo?: string;
    telefono?: string;
    listaCustodio?: IListaCustodio[];
    rondin?: IRondin[];

}

export interface IListaCustodio {
    ape_mat?: string;
    ape_pat?: string;
    cod_elemento?: string;
    id?: string;
    nombre?: string;
}

export interface IRondin {
    descripcion?: string;
    id?: number;
    num_rondin?: number;
    qr?: string;
}
