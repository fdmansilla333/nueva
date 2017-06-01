import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';


Personas = new Mongo.Collection("personas");
Personas.attachSchema(new SimpleSchema({
    cuit: {
        type: String,
        label: "*CUIT",
        regEx: /[0-9]{2}-[0-9]{8}-[0-9]{1,2}/,
        unique: true,
        index: true,
        autoform: {
            placeholder: "EJ: dd-dddddddd-dd, separe con guiones"
        }
        //TODO hacer la expresion regular para tomar el cuit en base a 2 digitos-8dni-2 digitos

    },
    apellido: {
        type: String,
        label: "*Apellido",
        min: 1,
        autoform: {
            placeholder: "Ingrese apellido"
        }
    },
    nombre: {
        type: String,
        label: "*Nombre",
        min: 1,
        autoform: {
            placeholder: "Ingrese nombre"
        }
    },
    tipoDocumento: {
        type: String,
        label: "*Tipo de documento",
        autoform: {
            type: 'select',
            firstOption: "Seleccione el tipo de documento",
            options: function () {
                return [
                    { label: "DNI", value: "DNI" },
                    { label: "Libreta Civica", value: "Libreta Civica" },
                    { label: "Libreta Enrolamiento", value: "Libreta Enrolamiento" },
                    { label: "Cedula de identidad", value: "Cedula de identidad" },
                    { label: "Pasaporte", value: "Pasaporte" }
                ]
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

    telefono: {
        type: String,
        optional: true,
        label: "Teléfono",
        regEx: /0[0-9]{2,4}-[0-9]{6,8}/,
        autoform: {
            placeholder: "EJ 011-12345678"
        }


    },
    celular: {
        type: String,
        optional: true,
        label: "Celular",
        regEx: /0[0-9]{2,4}-15[0-9]{6,8}/,
        //TODO agregar una expresion regular, y ver como agregar placeholder
        autoform: {
            placeholder: "EJ: 0280-154123456 + código de área + 15 + número de celular"
        }


    },
    email: {
        type: String,
        optional: true,
        label: "Correo electronico",
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
            placeholder: "Ingrese correo electrónico"
        }

    },
    cbu: {
        type: Number,
        optional: true,
        label: "Cuenta Bancaria Unica CBU",
        regEx: /[0-9]{22}/, //TODO ver un hook https://gist.github.com/delucas/4526176

    },
    condicionIva: {
        type: String,
        optional: true,
        label: "Condición ante el IVA",

        /*autoform: {
            afFieldInput: {
                firstOption: "(Seleccionar condición ante el IVA)"
            },
            option: function(){
                return [
                    {label:"Responsable Inscripto"},
                    {label: "Monostributista"},
                    {label: "Autonomo"}
                ]
            }
        }
        */
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
    codigoPostal: {
        type: Number,
        optional: true,
        regEx: /[0-9]{4}/, //Comprueba que sean 4 digitos
        label: "Codigo Postal",
        autoform: {
            placeholder: "Ingrese código postal de 4 digitos"
        }
    },
    tipoCliente: {
        type: String,
        label: "*Tipo de cliente",
        autoform: {
            type: 'select',
            firstOption: "(Seleccionar tipo de cliente)",
            options: function () {
                return [
                    { label: "Inquilino", value: "Inquilino" },
                    { label: "Propietario", value: "Propietario" },
                    { label: "Inquilino y Propietario", value: "Inquilino y Propietario" },
                    { label: "Garante", value: "Garante" }
                ]
            }
        }

    },
    caja: {
        type: Number,
        optional: true,
        autoform: {
            type: 'hidden',
            autovalue() {
                return 0;
            }
        },

    }

}, { tracker: Tracker }));


Meteor.methods({
    'personas.remove'(personaId) {
        check(personaId, String);
        Personas.remove(personaId);
    },
    'personas.insert'(persona) {
      
        Personas.insert(persona);
    }

});

//Tener en cuenta que los indices funcionan con campos de string
export const PersonasIndex = new EasySearch.Index({
    collection: Personas,
    fields: ['cuit', 'apellido', 'nombre', 'tipoCliente'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions: { limit: 10 }

});