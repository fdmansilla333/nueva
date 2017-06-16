
export function buscarServicios(idContrato) {
    console.log("Buscando servicios vigentes");
    contrato = Contratos.findOne({ _id: idContrato });
    if (contrato) {
        servicios = Servicios.find({ codigo: contrato.propiedad })
        if (servicios) {
            servicios = servicios.map(function (s) {
                return s;
            });
            return servicios;
        }
    }

}
export function buscarReparaciones(idContrato, fechaVigencia) {
    console.log("Buscando reparaciones vigentes");
    contrato = Contratos.findOne({ _id: idContrato });
    if (contrato) {
        reparaciones = Reparaciones.find({ codigo: contrato.propiedad });
        if (reparaciones) {
            reparaciones = reparaciones.map(function (r) {
                return r;
            });
            reparaciones = reparaciones.filter(function (r) {
                if (r.fechaPago <= fechaVigencia && !r.pagado) {
                    return true;
                } else {
                    return false;
                }
            });
            return reparaciones;
        }
    }
}

export function agregarSaldo(idPersona, saldo) {
    persona = Personas.findOne({ cuit: idPersona });
    if (persona) {
        console.log("Saldo agregado");

        Personas.remove(persona._id);
          if(persona.saldo){
            persona.saldo = parseFloat(persona.saldo)+parseFloat(saldo);
        }else{
            persona.saldo = parseFloat(saldo);
        }
        

        Personas.insert(persona);
        console.log(persona);
    }
}
export function quitarSaldo(idPersona, saldo) {
    persona = Personas.findOne({ cuit: idPersona });
    if (persona) {
        console.log("Saldo reducido");

        Personas.remove(persona._id);
        if(persona.saldo){
            persona.saldo = parseFloat(persona.saldo)-parseFloat(saldo);
        }else{
            persona.saldo = -parseFloat(saldo);
        }
        

        Personas.insert(persona);
        console.log(persona);
    }
}