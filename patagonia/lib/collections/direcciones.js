import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';


Direcciones = new Mongo.Collection("direcciones");
Direcciones.attachSchema(new SimpleSchema({
    pais: {
        type: String,
        label: "País",
        min: 1,
        autoform:{
            placeholder: "Ingrese País"
        }
    },
    provincia: {
        type: String,
        label: "Provincia o estado",
        min: 1,
           autoform:{
            placeholder: "Ingrese provincia"
        }

    },
    localidad: {
        type: String,
        label: "Ciudad o Localidad",
        min: 1,
           autoform:{
            placeholder: "Ingrese localidad"
        }
    },
  

}, { tracker: Tracker }));