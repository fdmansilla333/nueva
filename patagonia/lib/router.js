import { contratos, ContratosIndex } from '../lib/collections/Contratos';
import { personas, PersonasIndex } from '../lib/collections/Personas';
import { personasJuridicas, PersonasJuridicasIndex } from '../lib/collections/personasJuridicas';
import { inmuebles, InmueblesIndex } from '../lib/collections/inmuebles';
import { buscarServicios } from '../lib/utilidades.js';
import { buscarReparaciones } from '../lib/utilidades.js';


Router.route('/', function () {
  this.render('home');
});
//Altas
Router.route('/altaContrato', function () {
  this.render('altaContrato');
});
Router.route('/altaPersona', function () {
  this.render('altaPersonas');
});


Router.route('/personas', {
  name: 'personas',
  data: {
    personas() {
      return PersonasIndex;
    }
  }
});
Router.route('/altaInmueble', function () {
  this.render('altaInmueble');
});

//Ver si dejar esta tipo de alta
Router.route('/altaContratoV2', function () {
  this.render('altaContratoV2');
});
//Actualizaciones
Router.route('/actualizarContrato/:_id', function () {
  let contratos = Contratos.findOne({ _id: this.params._id });
  if (!contratos) {
    Router.go("contratos");
  } else {
    this.render('actualizarContrato', {
      data: contratos,
    })
  }
}, {
    name: "actualizarContrato"
  });

Router.route('/actualizarPersona/:_id', function () {
  let personas = Personas.findOne({ _id: this.params._id });
  if (!personas) {
    Router.go("personas");
  } else {
    this.render('actualizarPersona', {
      data: personas,
    })
  }
}, {
    name: "actualizarPersona"
  });

Router.route('/actualizarPersonaJuridica/:_id', function () {
  let personas = PersonasJuridicas.findOne({ _id: this.params._id });
  if (!personas) {
    Router.go("/personasJuridicas");
  } else {
    this.render('actualizarPersonaJuridica', {
      data: personas,
    })
  }
}, {
    name: "actualizarPersonaJuridica"
  });

Router.route('/actualizarInmueble/:_id', function () {
  let inmuebles = Inmuebles.findOne({ _id: this.params._id });
  if (!inmuebles) {
    Router.go("inmuebles");
  } else {
    this.render('actualizarInmueble', {
      data: inmuebles,
    })
  }
}, {
    name: "actualizarInmueble"
  });


//Raiz
Router.route('/contratos', {
  name: 'contratos',
  data: {
    contratos() {
      return ContratosIndex;
    }
  }
});


Router.route('/personasJuridicas', {
  name: 'personasJuridicas',
  data: {
    personasJuridicas() {
      return PersonasJuridicasIndex;
    }
  }
});

Router.route('/inmuebles', {
  name: 'inmuebles', //nombre del template donde se rutea
  data: {
    inmuebles() { //nombre dle indice
      return InmueblesIndex;
    }
  }
});



//Detalles
Router.route('/contratos/:_id', function () {

  let contratos = Contratos.findOne({ _id: this.params._id });

  if (!contratos) {
    Router.go('contratos');
  } else {
  
    var inquilino1 = Personas.findOne({ cuit: contratos.inquilino });
    var garante1 = Personas.findOne({cuit:contratos.garante});
    var inmueble1 = Inmuebles.findOne({ _id: contratos.propiedad });
    
    var propietario1 = Personas.findOne({ cuit: inmueble1.propietario });

    var cuponesPagos = CuponesPagos.find({contrato:contratos._id},{sort:{periodo:1}});
    
    
    cuponesPagos = cuponesPagos.map(function(cupon){
      return cupon;
    });

    cuponesPagos.forEach(function(cupon) {
      
      cupon.servicios = buscarServicios(cupon.contrato);
    }, this);

    cuponesPagos.forEach(function(cupon){
      cupon.reparaciones = buscarReparaciones(cupon.contrato, cupon.fechaVencimiento);
    }, this);
    
    contratos.datosPropietario = propietario1;
    contratos.datosInquilino = inquilino1;
    contratos.datosInmueble = inmueble1;
    contratos.datosGarante = garante1;
    contratos.cupones = cuponesPagos;

    contratos.selladoI = parseFloat(contratos.sellado)/2;
    contratos.selladoP = parseFloat(contratos.sellado)/2;
    contratos.comisionAdministrativaP = parseFloat(contratos.comisionAdministrativa)/100* parseFloat(contratos.contratoTotal);

    console.log(contratos);
    this.render('contratosDetalle', {
      data: contratos
    })
  }
}, {
    name: 'contratosDetalle'
  });

Router.route('/personas/:_id', function () {

  let personas = Personas.findOne({ _id: this.params._id });
  if (!personas) {
    Router.go('personas');
  } else {
    this.render('personasDetalle', {
      data: personas
    })
  }
}, {
    name: 'personasDetalle'
  });

Router.route('/personasJuridicasDetalle/:_id', function () {

  let personas = PersonasJuridicas.findOne({ _id: this.params._id });
  if (personas) {
    idArchivo = personas.idArchivo;
    archivo = archivosFS.findOne({ '_id': idArchivo });
    personas.url = archivo.url();

  }
  if (!personas) {
    Router.go('/personasJuridicas');
  } else {
    this.render('personasJuridicasDetalle', {
      data: personas
    })
  }
}, {
    name: 'personasJuridicasDetalle'
  });

Router.route('/inmuebles/:_id', function () {

  esPrimera = true;
  let inmuebles = Inmuebles.findOne({ _id: this.params._id });

  if (inmuebles) {
    inmuebles.imagenes = [];
    inmuebles.inventario = [];

    var elementosInventario = Inventario.find({ codigo: inmuebles._id });
    if (elementosInventario) {
      elementosInventario = elementosInventario.map(function (elem) {
        lista = [];
        if (elem.elemento) {
          for (i = 0; i < elem.elemento.length; i++) {
            lista[i] = elem.elemento[i];
          }
        }


        return lista;
      });
      resultado = [];
      t = 0;
      for (i = 0; i < elementosInventario.length; i++) {
        for (j = 0; j < elementosInventario[i].length; j++) {
          resultado[t] = elementosInventario[i][j];
          t = t + 1;
        }
      }
      inmuebles.inventario = resultado;
    }


    let imaInmueble = imagenesInmuebles.find({ codigo: inmuebles._id });

    if (imaInmueble) {
      listImage = imaInmueble.map(function (img) { return { "id": img.idImagen, "nombreImagen": img.nombreImagen, "descripcion": img.descripcion } });
      for (i = 0; i < listImage.length; i++) {
        let imaInmuebleFS = imagenesInmueblesFS.findOne({ _id: listImage[i].id });


        inmuebles.imagenes[i] = { "url": imaInmuebleFS.url(), "id": imaInmuebleFS._id, "nombreImagen": listImage[i].nombreImagen, "primeraVez": esPrimera, "descripcion": listImage[i].descripcion };

        if (esPrimera) {
          esPrimera = false;
        }


      }
    }

    let planosEncontrados = Planos.find({ codigo: inmuebles._id });
    if (planosEncontrados) {
      inmuebles.planos = [];
      listPlanos = planosEncontrados.map(function (p) { return { "id": p.idPlano, "descripcion": p.descripcion, } });
      for (i = 0; i < listPlanos.length; i++) {
        let listaPlanosFS = planoFS.findOne({ _id: listPlanos[i].id });
        inmuebles.planos[i] = { "url": listaPlanosFS.url(), "id": listaPlanosFS._id, "descripcion": listPlanos[i].descripcion };

      }
    }

    let serviciosEncontrados = Servicios.find({codigo: inmuebles._id});
    if (serviciosEncontrados){
      inmuebles.servicios = [];
      listServicios = serviciosEncontrados.map(function(ser){
        return {"descripcionServicio":ser.descripcionServicio, "tarifa":ser.tarifaServicio, "idServicio":ser._id};

      });
      inmuebles.servicios = listServicios;
    }
  }

  let reparacionesEncontradoas = Reparaciones.find({codigo: inmuebles._id});
  if (reparacionesEncontradoas){
    inmuebles.reparaciones=[];
    listReparaciones = reparacionesEncontradoas.map(function(rep){
       var fecha = rep.fechaPago.getDay() + "/" + String(rep.fechaPago.getMonth() + 1) + "/" + rep.fechaPago.getFullYear();
      return {"_id":rep._id, "codigo":rep.codigo, "descripcionReparacion":rep.descripcionReparacion, "fecha de pago":fecha, "importeReparacion":rep.importeReparacion};
    });
    inmuebles.reparaciones = listReparaciones;
  }
  if (!inmuebles) {

    Router.go('inmuebles');
  } else {
    console.log(inmuebles);
    this.render('inmueblesDetalle', {
      data: inmuebles
    })
  }
}, {
    name: 'inmueblesDetalle'
  });


//Agregado imagenes 
Router.route('/images', function () {
  this.render('subida');
});

Router.route('/verImagenes', function () {
  this.render('verImagenes');
});

//agregado formularios diseñados manualmente

Router.route('/altaInmueble2', function () {
  this.render('altaInmueble2');
});

//prueba carga collection autoform
Router.route('/pruebaImagen', function () {
  this.render('insertForm');
});
Router.route('/pruebaUpdate/:_id', function () {
  let documentos = Docs.findOne({ _id: this.params._id });

  console.log(documentos);
  if (!documentos) {
    Router.go('pruebaImagen');
  } else {
    this.render('imageUpdate', {
      data: documentos
    })
  }

});

Router.route('/pruebainmueble', function () {
  this.render('altainmuebleV3');
});

//ruta que carga las imagenes de los inmuebles
Router.route('/agregarImagenInmueble', function () {
  this.render('agregarImagenInmueble');
});


Router.route('/agregarPersonaJuridica', function () {
  this.render('agregarPersonaJuridica');
});

//Administración de inventarios
Router.route('/agregarInventario', function () {
  this.render('agregarInventario');
});

Router.route('/actualizarInventario/:_id', function () {

  let inventarioBuscado = Inventario.find({ codigo: this.params._id });
  inventarioBuscado = inventarioBuscado.map(function (elem) {
    return elem;
  });
  console.log(inventarioBuscado);
  listaObjetosPermitidos = inventarioBuscado.filter(function (elem) {
    if (!elem.elemento) {
      console.log("Borrando");
      console.log(elem);
      Inventario.remove({ _id: elem._id }); //borro el objeto de la colección dado que no posee inventarios adjuntos
      return false;
    } else {
      return true;
    }
  });
  if (listaObjetosPermitidos) {
    inventarioBuscado = listaObjetosPermitidos[0]; //devuelvo el primero
  }

  if (!inventarioBuscado) {
    Router.go('/inmuebles');
  } else {
    console.log(inventarioBuscado);
    this.render('actualizarInventario', {
      data: inventarioBuscado,
    })
  }
}, {
    name: 'actualizarInventario'
  }
);

//Manejo de los planos
Router.route('/agregarPlano', function () {
  this.render('agregarPlano');
});

//Manejo de reparaciones
Router.route('/agregarReparacion', function(){
  this.render('agregarReparacion');
});

Router.route('/prueba', function(){
  this.render('prueba');
});
