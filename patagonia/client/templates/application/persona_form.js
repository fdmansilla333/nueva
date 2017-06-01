import { Personas } from '../../../lib/collections/Personas';

import { Router } from 'meteor/iron:router';

import { AutoForm } from 'meteor/aldeed:autoform';

import { Meteor } from 'meteor/meteor';

Template.altaPersonas.onCreated(function () {
    AutoForm.addHooks(['altaPersonas'], {
        onSuccess: function (formType, result) {
            Router.go('personas');
        }
    })
});

Template.actualizarPersona.onCreated(function () {
    AutoForm.addHooks(['actualizarPersona'], {
        onSuccess: function (operacion, result, template) {
            Router.go('personas');
        }
    })
});


Template.personas.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea dar de baja la persona?");
        if (respuesta) {
            Meteor.call('personas.remove', this._id);
        }
    }
});


Template.altaPersonas.helpers({
    paisOptions: function () {
        lista = Direcciones.find().map(function (paises) {
            return paises;
        });
        contenedora = [];

        lista = lista.filter(function (e) {
            if (contenedora.indexOf(e.pais) < 0) { //no se encuentra
                contenedora.push(e.pais);
                return true;
            } else {
                return false;
            }
        });

        var listaPaises = lista.map(function (dir) {

            return { label: dir.pais, value: dir.pais };
        });

        return listaPaises;
    },
    pronviciaOptions: function () {
        var busPais = AutoForm.getFieldValue('pais');
        console.log(busPais);
        var listaProvincias;
        if (busPais) {
            listaProvincias = Direcciones.find({ pais: busPais }).map(function (prov) {
                return prov;
            });
            contenedora = [];

            lista = lista.filter(function (e) {
                if (contenedora.indexOf(e.provincia) < 0) { //no se encuentra
                    contenedora.push(e.provincia);
                    return true;
                } else {
                    return false;
                }
            });

            listaProvincias = lista.map(function (prov) {
                return { label: prov.provincia, value: prov.provincia };
            });
        }

        return listaProvincias;

    },
    localidadOptions: function () {

        var busProv = AutoForm.getFieldValue('provincia', 'altaPersonas');
        var busPais = AutoForm.getFieldValue('pais', 'altaPersonas');
        if (busProv && busPais) {
            return Direcciones.find({ pais: busPais, provincia: busProv }).map(function (loc) {
                return { label: loc.localidad, value: loc.localidad }
            });
        }

    }

});

Template.actualizarPersona.helpers({
    paisOptions: function () {
        lista = Direcciones.find().map(function (paises) {
            return paises;
        });
        contenedora = [];

        lista = lista.filter(function (e) {
            if (contenedora.indexOf(e.pais) < 0) { //no se encuentra
                contenedora.push(e.pais);
                return true;
            } else {
                return false;
            }
        });

        var listaPaises = lista.map(function (dir) {

            return { label: dir.pais, value: dir.pais };
        });

        return listaPaises;
    },
    pronviciaOptions: function () {
        var busPais = AutoForm.getFieldValue('pais');
        console.log(busPais);
        var listaProvincias;
        if (busPais) {
            listaProvincias = Direcciones.find({ pais: busPais }).map(function (prov) {
                return prov;
            });
            contenedora = [];

            lista = lista.filter(function (e) {
                if (contenedora.indexOf(e.provincia) < 0) { //no se encuentra
                    contenedora.push(e.provincia);
                    return true;
                } else {
                    return false;
                }
            });

            listaProvincias = lista.map(function (prov) {
                return { label: prov.provincia, value: prov.provincia };
            });
        }

        return listaProvincias;

    },
    localidadOptions: function () {

        var busProv = AutoForm.getFieldValue('provincia', 'actualizarPersona');
        var busPais = AutoForm.getFieldValue('pais', 'actualizarPersona');
        if (busProv && busPais) {
            return Direcciones.find({ pais: busPais, provincia: busProv }).map(function (loc) {
                return { label: loc.localidad, value: loc.localidad }
            });
        }

    }

});
