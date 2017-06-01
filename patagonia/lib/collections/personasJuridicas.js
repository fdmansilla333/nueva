import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';


PersonasJuridicas = new Mongo.Collection("personasJuridicas");
PersonasJuridicas.attachSchema(new SimpleSchema({
    cuit: {
        type: String,
        label: "*CUIT",
        regEx: /[0-9]{2}-[0-9]{8}-[0-9]{1,2}/,
        unique: true,
        index: true,
        autoform: {
            placeholder: "EJ: dd-dddddddd-dd, separe con guiones"
        }

    },
    razon: {
        type: String,
        label: "*Razón social",
        min: 1,
        autoform: {
            placeholder: "Ingrese nombre de la razón social"
        }
    },
    cuitRepresentanteLegal: {
        type: String,
        label: "*Cuit del Representante legal",
        regEx: /[0-9]{2}-[0-9]{8}-[0-9]{1,2}/,
        autoform: {
            placeholder: "Ingrese el cuit del representante legal"
        }
    },
    nombreRepresentanteLegal: {
        type: String,
        label: "*Nombre del representante legal",
        autoform: {
            placeholder: " Ingrese el nombre del representante legal"
        }
    },
    apellidoRepresentanteLegal: {
        type: String,
        label: "Apellido del representante legal",
        autoform: {
            placeholder: "Ingrese el apellido del representante legal"
        }
    },
    
    domicilioRepresentante:{
        type:String,
        label: "Domicilio del representante legal",
        optional: true,
        autoform:{
            placeholder:"Ingrese el domicilio"
        }
    },

    actaOPoder: {
        type: Boolean,
        label: "¿Entrega Poder o acta de representación?",
        optional: true,
        autoform: {
            type: 'boolean-checkbox'
        }
    },
    cuitApoderadoLegal: {
        type: String,
        label: "*Apoderado legal",
        regEx: /[0-9]{2}-[0-9]{8}-[0-9]{1,2}/,
        optional: true,
        autoform: {
            placeholder: "Ingrese el cuit del apoderado legal"
        }


    },
    nombreApoderadoLegal: {
        type: String,
        label: "*Nombre del apoderado legal",
        optional: true,
        autoform: {
            placeholder: " Ingrese el nombre del apoderado legal"
        }
    },
    apellidoApoderadoLegal: {
        type: String,
        label: "Apellido del apoderado legal",
        optional: true,
        autoform: {
            placeholder: "Ingrese el apellido del apoderado legal"
        }
    },
    domicilioApoderado:{
        type:String,
        label: "Domicilio del apoderado legal",
        optional: true,
        autoform:{
            placeholder:"Ingrese el domicilio"
        }
    },


    nombreArchivo: {
        type: String,
        optional: true,
        autoform: {
            placeholder: "nombre del archivo o espacio"
        }

    },
    idArchivo: {
        type: String,
        optional: true,
        autoform: {
            placeholder: "Arrastre el archivo o haga clic aquí"
        }

    },


}, { tracker: Tracker }));


//Agregado manejo de imagenes
archivosFS = new FS.Collection("archivosFS", {
    stores: [new FS.Store.GridFS("archivosStore")]
});

archivosFS.allow({
    download: function () {
        return true;
    },
    fetch: null
});

Meteor.methods({
    /**
     * Se remueve la personaJuridica y el archivo asociado a ella.
     */
    'personasJuridicas.remove'(personaId) {
        check(personaId, String);
        var idArchivoObtenido = PersonasJuridicas.find({ "_id": personaId }).map(function (elemento) {
            return elemento.idArchivo;
        });
        var archivoObtenido = archivosFS.findOne({ "_id": idArchivoObtenido[0] });
        PersonasJuridicas.remove(personaId);
        archivosFS.remove(idArchivoObtenido[0]);

    }

});

//Tener en cuenta que los indices funcionan con campos de string
export const PersonasJuridicasIndex = new EasySearch.Index({
    collection: PersonasJuridicas,
    fields: ['cuit', 'razon', 'cuitRepresentanteLegal', 'apellidoRepresentanteLegal'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions: { limit: 10 }

});