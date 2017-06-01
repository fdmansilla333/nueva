import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);
import { Tracker } from 'meteor/tracker';

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';


Inventario = new Mongo.Collection("inventario");
Inventario.attachSchema(new SimpleSchema({

    codigo: {
        type: String,
        label: "Codigo del Inmueble",
        autoform: {
            firstOption: "Seleccione un codigo de un inmueble",
            options: function () {
                var im = Inmuebles.find().map(function (im) {
                    var p = Personas.findOne({ cuit: im.propietario });
                    var j = PersonasJuridicas.findOne({ cuit: im.propietario });
                    dic = {};
                    if (p) {
                        dic = { "label": im._id + " a nombre de " + p.nombre + " " + p.apellido + " Dirección: " + im.calle + " " + im.nro, "value": im._id }
                    }
                    if (j) {
                        dic = { "label": im._id + " razon: " + j.razon + " representante:" + j.apellidoRepresentanteLegal + " dirección: " + im.calle + " " + im.nro, "value": im._id }
                    }
                    //console.log(dic);


                    return dic;
                });

                return im;
            },
            style: "width: 50%",



        }
    },
    elemento: {
        type: Array,
        optional: true,
        minCount: 0,
        maxCount: 100
    },
    'elemento.$': {
        // type: Object,
        type: String,
        label: "ingrese el elemento a inventariar",
        autoform: {
            style: "width: 50%",
            rows: 2,
            placeholder: "Ejemplo: Termotanque 80 L"

        }
    },

    // 'elemento.$.nombre': {
    //     type: String,
    //     optional: true,
    //     label: "Nombre del elemento",
    //     autoform: {
    //         placeholder: "Escribir el nombre del elemento. Ej: Termotanque eléctrico",
    //         type: 'textarea',
    //         rows: 2,
    //         style: "width: 50%",
    //     }
    // },
    // 'elemento.$.descripcion': {
    //     type: String,
    //     optional: true,
    //     label: "Descripción de nuevo elemento",
    //     autoform: {
    //         placeholder: "Coloque una descripción del elemento. Ej: Termotanque marca escorial de 80L",
    //         type: 'textarea',
    //         rows: 5,
    //         style: "width: 50%",
    //     }
    // }

}, { tracker: Tracker }));
