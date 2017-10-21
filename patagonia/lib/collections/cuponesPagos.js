import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';

CuponesPagos = new Mongo.Collection("cuponesPagos");
CuponesPagos.attachSchema(new SimpleSchema({

    contrato: {
        type: String,
        label: "Elegir el contrato donde aplica",
        autoform: {
            afFieldInput: {
                firstOption
                : "(Seleccionar contrato)"
            }
        }
    },

    periodo: {
        type: Number,
        label: "Periodo",
        autoform: {
            afFieldInput: {
                firstOption
                : "(Seleccionar Periodo)"
            }
        }
    },
    importe: {
        type: Number,
        label: "Importe adeudado",
        autoform:{
            step: 0.01,
            placeholder: "Ingrese el nuevo cupon de pago. Ej 4950.95",
            
        }
    },
    fechaVencimiento: {
        type: Date,
        label: "Fecha de vencimiento",
    },
    fechaPago: {
        type: Date,
        optional: true,
        label: "Fecha de pago",

    },
    pagado: {
        type: Boolean,
        label: "¿Fue abonado?",
    },
    servicios: {
        type: Array,
        label: "Servicios en el período",
        optional:true,
    },
    reparaciones: {
        type: Array,
        label: "Reparaciones en el período",
        optional: true,
    }


}, { tracker: Tracker }));



Meteor.methods({
    'cuponesPagos.remove'(cuponId) {
        check(cuponId, String);
        CuponesPagos.remove(cuponId);
    },
    'cuponesPagos.insert'(cupon) {
        console.log("Insertando cupon");
        CuponesPagos.insert(cupon);
    },
    'cuponesPagos.update'(idCupon, importe) {
        CuponesPagos.update({ _id: idCupon }, {
            set: {
                fechaPago: new Date, pagado: true, importe: importe
            }
        });

    },
    'cuponesPagos.agregarPago'(cupon){
        console.log(cupon);
    }
});