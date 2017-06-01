import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
//import {Inmuebles} from '../collections/inmuebles';

Planos = new Mongo.Collection("planos");
Planos.attachSchema(new SimpleSchema({
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
   
    idPlano:{
        type:String,
        autoform:{
            placeholder: "Arrastre el plano aquí o haga clic aquí"
        }

    },
    descripcion:{
        type:String,
        autoform:{
            placeholder: "Coloque una descripción del plano",
        }
    }



}, { tracker: Tracker }));

//Agregado manejo de imagenes
planoFS = new FS.Collection("planoFS", {
    stores: [new FS.Store.GridFS("planoStore")]
});

planoFS.allow({
    download: function () {
        return true;
    },
    fetch: null
});

Meteor.methods({
    'planos.remove'(planoId) {
        check(planoId, String);
        Planos.remove({idPlano:planoId});
        planoFS.remove(planoId);
    }
}
);