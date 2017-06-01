import { Contratos } from '../../../lib/collections/Contratos';

import { Router } from 'meteor/iron:router';

import { AutoForm } from 'meteor/aldeed:autoform';

import { Meteor } from 'meteor/meteor';

import { NumeroALetras } from '../application/numeroAletras.js';

Template.altaContrato.onCreated(function () {
    AutoForm.addHooks(['altaContrato'], {
        onSuccess: function (operacion, result, template) {
            Router.go('contratos');
        },
        before: {
            insert: function (document) {
                Meteor.call('contratos.insert', document, function (error) {
                    if (error) {
                        //TODO ver de que forma mostrar mejor los errores, en vez de utilizar alert
                        alert(error);
                    }
                });

                Router.go('contratos');
            }
        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) { console.log("Onsubmit") },

        onError: function (formType, error) { console.log("OnError") },
        beginSubmit: function () { console.log("beginSubmit") },
        endSubmit: function () { console.log("endSubmit") },
        after: {
            // Replace `formType` with the form `type` attribute to which this hook applies
            insert: function (error, result) { console.log("After") }
        },

    })
});

Template.actualizarContrato.onCreated(function () {
    AutoForm.addHooks(['actualizarContrato'], {
        onSuccess: function (operacion, result, template) {
            Router.go('contratos');
        }
    })
});


Template.contratos.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar el contrato?");
        if (respuesta) {
            Meteor.call('contratos.remove', this._id);
        }



    },
    'click .pdf': function (event, template) {

        var doc = new PDFDocument({ size: 'A4', margin: 50 });
        doc.fontSize(12);
        doc.text('PDFKit is simple', 10, 30, { align: 'center', width: 200 });
        doc.write('PDFKitExampleClientSide.pdf');
        // it will download the doc
        var numeroaletras = NumeroALetras(this.costoAlquiler);

    },
     'click .pagar': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea pagar el cupón de pago?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            Meteor.call('cuponesPagos.update', event.currentTarget.name);
        }
    },
});

//Funcion para formatear las dates al formato requerido, se usa un helper
Template.registerHelper('formatDate', function (date) {
    return moment(date).format('DD-MM-YYYY');
});

Template.altaContrato.helpers({
    propiedadesOptions: function () {
        var per = Inmuebles.find().map(function (inmueble) {
            persona = Personas.findOne({ cuit: inmueble.propietario });
            return { label: inmueble._id + " " + persona.apellido + " " + persona.nombre + " " + inmueble.calle + " " + inmueble.nro, value: inmueble._id }
        });
        console.log(per);
        return per;
    },
    inquilinoOptions: function () {
        var inquilinos = Personas.find().map(function (inquilinos) {
            return inquilinos;
        });
        inquilinos = inquilinos.filter(function (inquilino) {
            return inquilino.tipoCliente == "Inquilino" || inquilino.tipoCliente == "Inquilino y Propietario";
        });
        inquilinos = inquilinos.map(function (inquilino) {
            return { label: inquilino.apellido + " " + inquilino.nombre, value: inquilino.cuit };
        });
        return inquilinos;
    },
    garanteOptions: function () {
        var garante = Personas.find().map(function (garante) {
            return garante;
        });
        garante = garante.filter(function (garante) {
            return garante.tipoCliente == "Garante";
        });
        garante = garante.map(function (garante) {
            return { label: garante.apellido + " " + garante.nombre, value: garante.cuit };
        });
        return garante;
    }
});
