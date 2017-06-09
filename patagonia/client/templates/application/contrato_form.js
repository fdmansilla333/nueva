//import { Contratos } from '../../../lib/collections/Contratos';

import { Router } from 'meteor/iron:router';

import { AutoForm } from 'meteor/aldeed:autoform';

import { Meteor } from 'meteor/meteor';

import { NumeroALetras } from '../application/numeroAletras.js';

import { agregarSaldo } from '../../../lib/utilidades.js';
import { quitarSaldo } from '../../../lib/utilidades.js';


Template.altaContrato.onCreated(function () {
    AutoForm.addHooks(['altaContrato'], {
        onSuccess: function (operacion, result, template) {
            Router.go('contratos');
        },
        before: {
            insert: function (document) {
                Meteor.call('contratos.insert', document, function (error) {
                    if (error) {
                        //TODO ver de que forma mostrar mejor los errores, en vez de utilizar alert
                        alert(error);
                    }
                });

                Router.go('contratos');
            }
        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) { console.log("Onsubmit") },

        onError: function (formType, error) { console.log("OnError") },
        beginSubmit: function () { console.log("beginSubmit") },
        endSubmit: function () { console.log("endSubmit") },
        after: {
            // Replace `formType` with the form `type` attribute to which this hook applies
            insert: function (error, result) { console.log("After") }
        },

    })
});

Template.actualizarContrato.onCreated(function () {
    AutoForm.addHooks(['actualizarContrato'], {
        onSuccess: function (operacion, result, template) {
            Router.go('contratos');
        }
    })
});

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
function buscarReparaciones(idContrato, fechaVigencia) {
    console.log("Buscando reparaciones vigentes");
    contrato = Contratos.findOne({ _id: idContrato });
    if (contrato) {
        reparaciones = Reparaciones.find({ codigo: contrato.propiedad });
        if (reparaciones) {
            reparaciones = reparaciones.map(function (r) {
                return r;
            });
            reparaciones = reparaciones.filter(function (r) {
                if (r.fechaReparacion <= fechaVigencia) {
                    return true;
                } else {
                    return false;
                }
            });
            return reparaciones;
        }
    }
}

function buscarImporteConMora(contrato, importe, cantidadDias) {
    contrato = Contratos.findOne({ _id: contrato });
    if (contrato) {
        if (contrato.tipoDeMora) {
            console.log("Tipo de mora valor fijo");
            return parseFloat(contrato.moraFijo) * parseFloat(cantidadDias) + importe;
        } else {
            console.log("Tipo de mora porcentaje");
            return parseFloat(importe) + ((parseFloat(contrato.moraPorcentaje) / 100) * parseFloat(cantidadDias) * parseFloat(importe));

        }
    }
}
function calcularTotales(cupon) {
    var importe = parseFloat(cupon.importe);

    var sumaServicios = 0;
    cupon.servicios.forEach(function (servicio) {
        sumaServicios = parseFloat(servicio.tarifaServicio) + sumaServicios;
    }, this);

    return importe + sumaServicios;

}
Template.contratosDetalle.events({
    'click .pagar': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea pagar el cupón de pago?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            cupon = CuponesPagos.findOne({ _id: event.currentTarget.name });
            hoy = new Date;
            contrato = Contratos.findOne({ _id: cupon.contrato });

            if (cupon.fechaVencimiento < hoy) {
                console.log("Existe mora");
                cantidadDias = moment(hoy).diff(cupon.fechaVencimiento, 'days');
                alert("Existe mora, la cantidad de días de mora es:" + String(cantidadDias));

                cupon.importe = buscarImporteConMora(cupon.contrato, cupon.importe, cantidadDias);
                cupon.servicios = buscarServicios(cupon.contrato);
                cupon.reparaciones = buscarReparaciones(cupon.contrato, cupon.fechaVencimiento);
                cupon.importe = calcularTotales(cupon);
                //TODO separar los pagos, en servicios, reparaciones, mora e importe


                var respuesta = confirm("Acepta pagar el Importe con moratoria: $" + String(cupon.importe));
                if (respuesta) {
                    Meteor.call('cuponesPagos.remove', cupon._id);
                    cupon.pagado = true;
                    cupon.fechaPago = new Date;
                    Meteor.call('cuponesPagos.insert', cupon);
                    agregarSaldo(contrato.inquilino, cupon.importe);
                    agregarSaldo(contrato.propietario, cupon.importe);


                } else {
                    alert("Operación cancelada");
                }

            } else {
                Meteor.call('cuponesPagos.remove', cupon._id);
                cupon.pagado = true;
                cupon.fechaPago = new Date;
                cupon.servicios = buscarServicios(cupon.contrato);
                cupon.reparaciones = buscarReparaciones(cupon.contrato, cupon.fechaVencimiento);
                cupon.importe = calcularTotales(cupon);
                Meteor.call('cuponesPagos.insert', cupon);
                agregarSaldo(contrato.inquilino, cupon.importe);
                agregarSaldo(contrato.propietario, cupon.importe);
                //TODO falta agregar reparaciones y los servicios como pagados

            }

        }
    },
    'click .pagado': function (event, template) {
        cupon = CuponesPagos.findOne({ _id: event.currentTarget.name });
        if (cupon) {
            var doc = new PDFDocument({ size: 'A4', margin: 50 });
         
            doc.fontSize(14);
            doc.text('Comprobante definitivo de pago:' + String(cupon._id), { align: 'center', width: 500 }).moveDown(1);

            doc.fontSize(12);

            doc.text('Código del contrato:' + String(cupon.contrato), { align: 'left', width: 500 }).moveDown(1);
            doc.text('Nro de cuota o período abonado:' + String(cupon.periodo), { align: 'left', width: 500 }).moveDown(1);
            var numeroaletras = NumeroALetras(cupon.importe);
            doc.text('Importe abonado: $' + String(cupon.importe) + " " + numeroaletras, { align: 'left', width: 500 }).moveDown(1);
            var fecha = moment(cupon.fechaPago).format('DD-MM-YYYY');
            var vencimiento = moment(cupon.fechaVencimiento).format('DD-MM-YYYY');
            doc.text('Fecha de vencimiento:' + String(vencimiento), { align: 'left', width: 500 }).moveDown(1);
            doc.text('Fecha de pago:' + String(fecha), { align: 'left', width: 500 }).moveDown(1);
            doc.text('Moratoria:', { align: 'left', width: 500 }).moveDown(1);
            doc.text('Servicios pagados:', { align: 'left', width: 500 }).moveDown(1);
            doc.text('Reparaciones en este período:', { align: 'left', width: 500 }).moveDown(1);
            doc.rect(doc.x, 75, 500, doc.y).stroke();

            doc.write(String(cupon._id) + '.pdf');
            // it will download the doc

        }

    },
});
Template.contratos.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar el contrato?");
        if (respuesta) {
            Meteor.call('contratos.remove', this._id);
        }



    },
    'click .pdf': function (event, template) {

        var doc = new PDFDocument({ size: 'A4', margin: 50 });
        doc.fontSize(12);
        doc.text('PDFKit is simple', 10, 30, { align: 'center', width: 200 });
        doc.write('PDFKitExampleClientSide.pdf');
        // it will download the doc
        var numeroaletras = NumeroALetras(this.costoAlquiler);

    },

});

//Funcion para formatear las dates al formato requerido, se usa un helper
Template.registerHelper('formatDate', function (date) {
    return moment(date).format('DD-MM-YYYY');
});

Template.altaContrato.helpers({
    propiedadesOptions: function () {
        var per = Inmuebles.find().map(function (inmueble) {
            persona = Personas.findOne({ cuit: inmueble.propietario });
            return { label: inmueble._id + " " + persona.apellido + " " + persona.nombre + " " + inmueble.calle + " " + inmueble.nro, value: inmueble._id }
        });
        console.log(per);
        return per;
    },
    inquilinoOptions: function () {
        var inquilinos = Personas.find().map(function (inquilinos) {
            return inquilinos;
        });
        inquilinos = inquilinos.filter(function (inquilino) {
            return inquilino.tipoCliente == "Inquilino" || inquilino.tipoCliente == "Inquilino y Propietario";
        });
        inquilinos = inquilinos.map(function (inquilino) {
            return { label: inquilino.apellido + " " + inquilino.nombre, value: inquilino.cuit };
        });
        return inquilinos;
    },
    garanteOptions: function () {
        var garante = Personas.find().map(function (garante) {
            return garante;
        });
        garante = garante.filter(function (garante) {
            return garante.tipoCliente == "Garante";
        });
        garante = garante.map(function (garante) {
            return { label: garante.apellido + " " + garante.nombre, value: garante.cuit };
        });
        return garante;
    },
    tipoDeMoraF: function () {
        var t = AutoForm.getFieldValue('tipoDeMora', 'altaContrato');
        if (t) {
            console.log("Selecciono porcentaje");
            return false;
        } else {
            console.log("Selecciono valor porcentaje");
            return true;
        }
    }
});
