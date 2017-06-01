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
        label: "Importe adeudado"
    },
    fechaVencimiento:{
        type: Date,
        label:"Fecha de vencimiento"
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


}, { tracker: Tracker }));


Meteor.methods({
    'cuponesPago.remove'(cuponId) {
        check(cuponId, String);
        CuponesPagos.remove(cuponId);
    },
    'cuponesPago.insert'(cupon) {
        console.log("Insertando cupon");
        CuponesPagos.insert(cupon);
    },
    'cuponesPagos.update'(id){
        console.log(id);
    }
});