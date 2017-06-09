import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
//import {Inmuebles} from '../collections/inmuebles';

Reparaciones = new Mongo.Collection("reparaciones");
Reparaciones.attachSchema(new SimpleSchema({
    codigo: {
        type: String,
        label: "Codigo del Inmueble",
        autoform: {
            firstOption: "Seleccione un codigo de un inmueble",
            options: function () {
                var im = Inmuebles.find().map(function (im) {
                       var p=Personas.findOne({cuit:im.propietario});
                       
                    return {"label":im._id+" a nombre de "+p.nombre+" "+p.apellido+" Dirección: "+im.calle+" "+im.nro, "value":im._id};
                });

                return im;
            }

        }
    },
   
    descripcionReparacion:{
        type:String,
        label: 'Nombre o descripción de la reparación realizada',
        autoform:{
            placeholder: "Ingrese nombre o descripción de la reparación"
        }

    },
    importeReparacion:{
        type: Number,
        label: "Ingrese el importe de la reparación",
        min: 0,
        autoform: {
            placeholder: "Ingrese la tarifa de la reparación",
            step: 0.001,
        }
    },
    fechaReparacion:{
        type: Date,
        label: "Ingrese la fecha de reparación",
        autoform:{
            placeholder: "Fecha de reparación dd/mm/aaaa",
            type: 'date'
        }
    },
     pagado: {
        type: Boolean,
        label: "¿Fue abonado?",
        optional: true
    },
    



}, { tracker: Tracker }));


Meteor.methods({
    'reparaciones.remove'(id) {
        check(id, String);
        Reparaciones.remove({_id:id});
       
    }
}
);