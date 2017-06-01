import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
//import {Inmuebles} from '../collections/inmuebles';

imagenesInmuebles = new Mongo.Collection("imagenesInmuebles");
imagenesInmuebles.attachSchema(new SimpleSchema({
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
    nombreImagen:{
        type:String,
        autoform:{
            placeholder: "nombre de la imagen o espacio"
        }

    },
    idImagen:{
        type:String,
        autoform:{
            placeholder: "Arrastre la imagen aquí o haga clic aquí"
        }

    },
    descripcion:{
        type:String,
        autoform:{
            placeholder: "Coloque una descripción de la imágen",
        }
    }



}, { tracker: Tracker }));

//Agregado manejo de imagenes
imagenesInmueblesFS = new FS.Collection("imagenesInmueblesFS", {
    stores: [new FS.Store.GridFS("imagenesInmueblesStore")]
});

imagenesInmueblesFS.allow({
    download: function () {
        return true;
    },
    fetch: null
});

Meteor.methods({
    'imagenesInmuebles.remove'(imageId) {
        check(imageId, String);
        imagenesInmuebles.remove({idImagen:imageId});
        imagenesInmueblesFS.remove(imageId);
    }
}
);