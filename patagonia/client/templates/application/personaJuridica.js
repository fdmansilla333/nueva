import { personasJuridicas } from '../../../lib/collections/personasJuridicas';

import { Router } from 'meteor/iron:router';

import { AutoForm } from 'meteor/aldeed:autoform';

import { Meteor } from 'meteor/meteor';

Template.agregarPersonaJuridica.onCreated(function () {
    AutoForm.addHooks(['agregarPersonaJuridica'], {
        onSuccess: function (formType, result) {
            Router.go('/personasJuridicas');
        }
    })
});

Template.actualizarPersonaJuridica.onCreated(function () {
    AutoForm.addHooks(['actualizarPersonaJuridica'], {
        onSuccess: function (operacion, result, template) {
            Router.go('/personasJuridicas');
        }
    })
});


Template.personasJuridicas.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea dar de baja la persona jurídica?");
        if (respuesta) {
            Meteor.call('personasJuridicas.remove', this._id);
        }
    }
});