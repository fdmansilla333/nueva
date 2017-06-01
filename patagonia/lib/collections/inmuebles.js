//clave api google maps  = AIzaSyDDhHm8SL2ikt5ODODy0EAX27eoItlPReU
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);
import { Tracker } from 'meteor/tracker';

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';

esquemaCiudades = {};
Ciudades = new Mongo.Collection("ciudades");
esquemaCiudades = new SimpleSchema({
    nombre: {
        type: String,
        max: 60
    },
    localidad: {
        type: String,
        autoform: {
            type: 'map',
            afFieldInput: {
                geolocation: true,
                autolocate: true,
                mapType: 'hybrid',
                SearchBox: true
            }
        }
    }
});
Ciudades.attachSchema(esquemaCiudades);


Inmuebles = new Mongo.Collection("inmuebles");
Inmuebles.attachSchema(new SimpleSchema({
    tipo: {
        type: String,
        label: "Tipo de convenio (Venta o Alquiler)",
        autoform: {
            firstOption: "Seleccionar tipo de inmueble",
            options: function () {
                return [
                    { label: "Venta", value: "Venta" },
                    { label: "Alquiler", value: "Alquiler" },
                    { label: "Venta y Alquiler", value: "Venta y Alquiler" },
                ]
            }
        }

    },
    propietario: {
        type: String,
        label: "CUIT del propietario o razon",
        autoform: {
            firstOption: "Seleccione un propietario",
            options: function () {
                var per = Personas.find().map(function (p) {
                    return p;
                });
                per = per.filter(function (p) {
                    return p.tipoCliente == "Propietario" || p.tipoCliente == "Inquilino y Propietario";
                });

                var juri = PersonasJuridicas.find().map(function (j) {
                    return j;
                })

                per = per.map(function (per) {

                    return { "label": per.apellido + " " + per.nombre, "value": per.cuit };

                });

                juri = juri.map(function (j) {
                    return { "label": j.razon + " " + j.cuit + " " + j.apellidoRepresentanteLegal, "value": j.cuit };
                });

                return per.concat(juri);

            }

        }

    },
    pais: {
        type: String,
        optional: true,
        label: "País",
        autoform: {
            type: 'select',
            firstOption: "Seleccione el país",
        }

    },
    provincia: {
        type: String,
        optional: true,
        label: "Provincia",
        autoform: {
            type: 'select',
            firstOption: "Seleccione provincia",

        }
    },
    localidad: {
        type: String,
        optional: true,
        label: "Localidad",
        autoform: {
            type: "select",
            firstOption: "Seleccione localidad",

        }

    },
    calle: {
        type: String,
        optional: true,
        label: "Calle",
        min: 1,
        autoform: {
            placeholder: "Ingrese la calle"
        }

    },
    nro: {
        type: Number,
        optional: true,
        min: 0,
        label: "Numeración o nro",
        autoform: {
            placeholder: "Ingrese la numeración o cero para s/n"
        }

    },
    tipoDeBien: {
        type: String,
        label: "Tipo de bien inmueble",
        autoform: {
            firstOption: "Seleccionar tipo del bien inmueble",
            options: function () {
                return [
                    { label: "Departamento", value: "Departamento" },
                    { label: "Local", value: "Local" },
                    { label: "Duplex", value: "Duplex" },
                    { label: "Casa", value: "Casa" },
                    { label: "Galpón", value: "Galpón" },
                    { label: "Lote", value: "Lote" },
                    { label: "Chacra", value: "Chacra" },
                    { label: "Estancia", value: "Estancia" },
                ]
            }
        }
    },
    datosDepto: {
        type: Object,
        optional: true,
        label: "Datos del departamento o local"
    },
    'datosDepto.sector': {
        type: String,
        optional: true,
        label: "Sector del departamento",
        autoform: {
            placeholder: "Letra o número de identificación del sector"
        }

    },
    'datosDepto.piso': {
        type: String,
        optional: true,
        label: "Piso del departamento",
        autoform: {
            placeholder: "Número del piso"
        }


    },
    'datosDepto.escalera': {
        type: String,
        optional: true,
        label: "Escalera del departamento",
        autoform: {
            placeholder: "Número de escalera"
        }

    },
    'datosDepto.identificacion': {
        type: String,
        optional: true,
        label: "Identificación del departamento",
        autoform: {
            placeholder: "Letra o número de identificación. Ej A"
        }

    },

    superficieTerreno: {
        type: Number,
        label: "Superficie del terreno en metros cuadrados",
        min: 1,
        optional: true,
        autoform: {
            placeholder: "Ingrese un número de superfice mayor a 1",
            step: 0.01,
        }
    },
    superficieCubierta: {
        type: Number,
        label: "Superficie cubierta en metros cuadrados",
        min: 1,
        optional: true,
        autoform: {
            placeholder: "Ingrese un número de superfice mayor a 1",
            step: 0.01,
        }

    },
    poseePlanos: {
        type: Boolean,
        label: "¿Presenta planos?",
        optional: true,
        autoform: {
            type: 'boolean-checkbox'
        }

    },
    poseeFotos: {
        type: Boolean,
        label: "¿Presenta fotos?",
        optional: true,
        autoform: {
            type: 'boolean-checkbox'
        }

    }





}, { tracker: Tracker }));



Meteor.methods({
    'Inmuebles.remove'(inmuebleId) {
        check(inmuebleId, String);
        Inmuebles.remove(inmuebleId);
        imagenesInmuebles.remove(inmuebleId);
    }

});

//Necesario para cargar el mapa
if (Meteor.isClient) {
    Meteor.startup(function () {
        GoogleMaps.load({ key: "AIzaSyDDhHm8SL2ikt5ODODy0EAX27eoItlPReU" }, { libraries: 'places' });
    });
}

export const InmueblesIndex = new EasySearch.Index({
    collection: Inmuebles,
    fields: ['tipo', 'propietario', 'calle', 'nro'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions: { limit: 10 }

});
