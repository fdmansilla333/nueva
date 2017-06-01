import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
//import {Inmuebles} from '../collections/inmuebles';

Servicios = new Mongo.Collection("servicios");
Servicios.attachSchema(new SimpleSchema({
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
   
    descripcionServicio:{
        type:String,
        label: 'Nombre o descripción del servicio',
        autoform:{
            placeholder: "Ingrese nombre o descripción del servicio"
        }

    },
    tarifaServicio:{
        type: Number,
        label: "Tarifa del servicio",
        min: 0,
        optional: true,
        autoform: {
            placeholder: "Ingrese la tarifa",
            step: 0.001,
        }
    },
    



}, { tracker: Tracker }));


Meteor.methods({
    'servicios.remove'(id) {
        check(id, String);
        Servicios.remove({_id:id});
       
    }
}
);