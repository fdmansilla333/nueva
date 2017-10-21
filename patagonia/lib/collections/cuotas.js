import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);
Cuotas = new Mongo.Collection("cuotas");
Cuotas.attachSchema(new SimpleSchema({
  importe: {
    type: Number,
    label: "Importe de nuevo vencimiento",
    min: 0,
    autoform: {
        type:Number
    }
  },
  fechaPromesaPago: {
    type: Date,
    label: "Fecha promesa de pago",
    optional: true
  }
  
}, { tracker: Tracker }));

Meteor.methods({
    'cuotas.insert'(cuota) {
        console.log(cuota);
    }
});
