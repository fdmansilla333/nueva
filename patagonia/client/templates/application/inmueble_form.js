
Template.inmueblesDetalle.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar la imagen?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            Meteor.call('imagenesInmuebles.remove', event.currentTarget.name);
        }
    },
    'click .removePlano': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar el plano?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            Meteor.call('planos.remove', event.currentTarget.name);
        }
    },
    'click .removeServicio': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar el servicio?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            Meteor.call('servicios.remove', event.currentTarget.name);
        }
    },
     'click .removeReparacion': function (event, template) {
        var respuesta = confirm("¿Esta seguro que desea eliminar la reparación?");
        console.log(event.currentTarget.name);
        if (respuesta) {
            Meteor.call('reparaciones.remove', event.currentTarget.name);
        }
    },


}
);

Template.inmuebles.events({
    'click .remove': function (event, template) {
        var respuesta = confirm("¿Desea eliminar el inmueble?");
        if (respuesta) {
            Meteor.call('Inmuebles.remove', this._id);
        }
    }
});

Template.altaInmueble.helpers({
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

        var listaProvincias;
        if (busPais) {
            listaProvincias = Direcciones.find({ pais: busPais }).map(function (prov) {

                return prov;
            });
            contenedora = [];
            console.log(lista);

            lista = lista.filter(function (e) {
                if (contenedora.indexOf(e.provincia) < 0) { //no se encuentra
                    contenedora.push(e.provincia);
                    console.log("Agregando" + e.provincia);
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

        var busProv = AutoForm.getFieldValue('provincia', 'altaInmueble');
        var busPais = AutoForm.getFieldValue('pais', 'altaInmueble');
        if (busProv && busPais) {
            return Direcciones.find({ pais: busPais, provincia: busProv }).map(function (loc) {
                return { label: loc.localidad, value: loc.localidad }
            });
        }

    },
    tipoDeBienF: function () {
        var t = AutoForm.getFieldValue('tipoDeBien', 'altaInmueble');
        if (t == "Departamento" || t == "Local") {
            return true;
        } else {
            return false;
        }

    }
}
);

Template.inmueblesDetalle.helpers({
    tipoDeBienF: function () {
        console.log("llamando al helper inmuebles detalle");
        var t = AutoForm.getFieldValue('tipoDeBien', 'inmueblesDetalle');
        if (t == "Departamento" || t == "Local") {
            return true;
        } else {
            return false;
        }

    }
});



Template.altaInmueble.onCreated(function () {
    AutoForm.addHooks(['altaInmueble'], {
        onSuccess: function (formType, result) {
            Router.go('/inmuebles');
        },
        onError: function (formType, error) {
            alert("Hubo un error:" + error);
        }
    })
});

AutoForm.hooks({
    agregarImagen: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) { console.log("Onsubmit") },
        onSuccess: function (formType, result) {
            this.resetForm();
            alert("Se ha cargado correctamente una imagen con su descripción");
        },
        onError: function (formType, error) { console.log("OnError") },
        beginSubmit: function () { console.log("beginSubmit") },
        endSubmit: function () { console.log("endSubmit") }
    }
});

