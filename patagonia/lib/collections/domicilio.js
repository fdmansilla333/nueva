import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';


Domicilios = new Mongo.Collection("domicilios");
Domicilios.attachSchema( new SimpleSchema({
    calle: {
        type: String,
        label: "Calle",
        min: 1,
        autoform:{
            placeholder: "Ingrese la calle"
        }

    },
    nro: {
        type: Number,
        min: 0,
        label: "Numeración o nro",
        autoform:{
            placeholder:"Ingrese la numeración o cero para s/n"
        }

    },
    codigoPostal: {
        type: Number,
        regEx: /[0-9]{4}/, //Comprueba que sean 4 digitos
        label: "Codigo Postal",
        autoform:{
            placeholder: "Ingrese código postal de 4 digitos"
        }
    }

}, { tracker: Tracker }));