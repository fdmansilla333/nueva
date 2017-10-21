import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';
import { agregarSaldo } from '../utilidades.js';
import { quitarSaldo } from '../utilidades.js';


SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            "fechaFin": "Tiene que ser una fecha posterior a la de inicio del período anterior",
            "fechaInicio": "Tiene que comenzar un día después de la finalización del período anterior",
        },
    },
});

Contratos = new Mongo.Collection("contratos");
Contratos.attachSchema(new SimpleSchema({

    propiedad: {
        type: String,
        label: "Código de la propiedad",
        autoform: {
            afFieldInput: {
                firstOption
                : "(Seleccionar Inmueble)"
            }
        }
    },
    inquilino: {
        type: String,
        label: "CUIT del Inquilino",
        autoform: {
            afFieldInput: {
                firstOption
                : "(Seleccionar Inquilino)"
            }
        }
    },
    garante: {
        type: String,
        label: "CUIT del garante",
        autoform: {
            afFieldInput: {
                firstOption
                : "(Seleccionar garante)"
            }
        }
    },
    costoAlquiler: {
        type: Number,
        label: "Costo del alquiler mensual en el primer período",
        min: 0,
        autoform: {
            placeholder: "Ingrese el alquiler. Ej 4950.95",
            step: 0.01,

        }
    },
    costoAlquiler2: {
        type: Number,
        label: "Costo del alquiler mensual en el segundo período",
        min: 0,
        autoform: {
            placeholder: "Ingrese el alquiler. Ej 4950.95",
            step: 0.01,
        }
    },
    costoAlquiler3: {
        type: Number,
        label: "Costo del alquiler mensual en el tercer período",
        min: 0,
        autoform: {
            placeholder: "Ingrese el alquiler. Ej 4950.95",
            step: 0.01,
        }
    },
    costoAlquiler4: {
        type: Number,
        label: "Costo del alquiler mensual en el cuarto período",
        min: 0,
        autoform: {
            placeholder: "Ingrese el alquiler. Ej 4950.95",
            step: 0.01,
        }
    },
    inicioContrato: {
        type: Date,
        label: "Inicio del primer período",
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del comienzo del período'
        }
    },
    finContrato: {
        type: Date,
        label: "Fin del primer período",
        custom: function () {
            //verificando que la fecha de inicio del contrato sea mayor a la fecha de inicio
            if (this.field('inicioContrato').value > this.field('finContrato').value) {
                return "fechaFin";
            } else {
                //si no hubo error establezco el minimo del otro inicioContrato2
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del fin del período',

        }

    },
    inicioContrato2: {
        type: Date,
        label: "Inicio del segundo período ",
        custom: function () {
            finContrato = this.field('finContrato').value;
            inicioContrato2 = this.field('inicioContrato2').value;
            //agregar que el inicio y fin del contrato que arranquen con un dia de diferencia 
            inicio = moment(finContrato);
            fin = moment(inicioContrato2);
            comparador = moment(inicio).add(1, 'days');
            //Debe comenzar la fecha de fin con un día mas
            if (!(comparador.isSame(fin))) {
                return "fechaInicio";
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del comienzo del período 2'
        }
    },
    finContrato2: {
        type: Date,
        label: "Fin del segundo período",
        custom: function () {
            //verificando que la fecha de inicio del contrato sea mayor a la fecha de inicio
            if (this.field('inicioContrato2').value > this.field('finContrato2').value) {
                return "fechaFin";
            } else {
                //si no hubo error establezco el minimo del otro inicioContrato2
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del fin del período 2'
        }

    },
    inicioContrato3: {
        type: Date,
        label: "Inicio del tercer período",
        custom: function () {
            finContrato = this.field('finContrato2').value;
            inicioContrato3 = this.field('inicioContrato3').value;
            //agregar que el inicio y fin del contrato que arranquen con un dia de diferencia 
            inicio = moment(finContrato);
            fin = moment(inicioContrato3);
            comparador = moment(inicio).add(1, 'days');
            //Debe comenzar la fecha de fin con un día mas
            if (!(comparador.isSame(fin))) {
                return "fechaInicio";
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del comienzo del período 3'
        }
    },
    finContrato3: {
        type: Date,
        label: "Fin del tercer período",
        custom: function () {
            //verificando que la fecha de inicio del contrato sea mayor a la fecha de inicio
            if (this.field('inicioContrato3').value > this.field('finContrato3').value) {
                return "fechaFin";
            } else {
                //si no hubo error establezco el minimo del otro inicioContrato2
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del fin del período 3'
        }

    },
    inicioContrato4: {
        type: Date,
        label: "Inicio del cuarto período",
        custom: function () {
            finContrato = this.field('finContrato3').value;
            inicioContrato3 = this.field('inicioContrato4').value;
            //agregar que el inicio y fin del contrato que arranquen con un dia de diferencia 
            inicio = moment(finContrato);
            fin = moment(inicioContrato3);
            comparador = moment(inicio).add(1, 'days');
            //Debe comenzar la fecha de fin con un día mas
            if (!(comparador.isSame(fin))) {
                return "fechaInicio";
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del comienzo del período 4'
        }
    },
    finContrato4: {
        type: Date,
        label: "Fin del cuarto período",
        custom: function () {
            //verificando que la fecha de inicio del contrato sea mayor a la fecha de inicio
            if (this.field('inicioContrato4').value > this.field('finContrato4').value) {
                return "fechaFin";
            } else {
                //si no hubo error establezco el minimo del otro inicioContrato2
            }
        },
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del fin del período 4'
        }

    },
    comisionInmobiliaria: {
        type: Number,
        label: "Comision inmobiliaria",
        autoform: {
            placeholder: "Ingrese la comisión inmobiliaria. Ej: 1239.23",
            step: 0.001,
        }
    },
    comisionAdministrativa: {
        type: Number,
        label: "Comisión administrativa %",
        min: 0,
        autoform: {
            placeholder: "Ingrese la comisión administrativa. Ej: 12",
            step: 0.001,
        }
    },
    sellado: {
        type: Number,
        optional: true,
        label: "Sellado",
        autoform: {
            autovalue() {
                return 0;
            },
            placeholder: 'Ingrese el sellado',
        }
    },
    duracionMeses: {
        type: Number,
        optional: true,
        label: "Duración del contrato en meses",
        autoform: {
            type: "hidden",
            autovalue() {
                return 0;
            }
        }
    },
    pagare: {
        type: Number,
        label: "Pagare",
        min: 0,
        autoform: {
            placeholder: "Ingrese el monto del pagaré. Ej: 1234",
            step: 0.001,
        }
    },
    impPagare: {
        type: Number,
        label: "Impuesto pagaré",
        min: 0,
        optional: true,
        autoform: {
            placeholder: "Calculado",
            step: 0.001,
        }

    },
    multaSellado: {
        type: Number,
        label: "Multa de sellado",
        min: 0,
        optional: true,
        autoform: {
            placeholder: "Ingresar multa del sellado",
            step: 0.001,
        }
    },
    depositoGarantia: {
        type: Number,
        label: "Depósito en garantía",
        optional: true,
        autoform: {
            placeholder: "Ingresar el depósito que proporciona el inquilino",
            step: 0.001,
        }
    },
    tipoDeMora: {
        type: Boolean,
        label: 'Seleccione el tipo de mora',
        autoform: {
            type: 'boolean-radios',
            trueLabel: 'Valor fijo',
            falseLabel: 'Porcentaje',
            value: false
        }
    },
    moraPorcentaje: {
        type: Number,
        label: "Porcentaje de la mora diario",
        optional: true,
        autoform: {
            placeholder: "Ingresar el porcentaje de la mora",
            step: 0.001,
        }
    },
    moraFijo: {
        type: Number,
        label: "Valor fijo de la mora diario",
        optional: true,
        autoform: {
            placeholder: "Ingresar el valor fijo diario",
            step: 0.001,
        }
    },
    contratoTotal: {
        type: Number,
        optional: true,
        label: "Costo total del contrato",
        autoform: {
            type: "hidden",
            autovalue() {
                return 0;
            }
        }
    },


}, { tracker: Tracker }));

///genera los cupones de pago de todo el contrato
function generarCuponesDePagos(contrato, id) {
    console.log("Generando cupones de pago");
    console.log(contrato);
    var esPrimero = true;
    fechaVencimientoCuota = [];

    primerPeriodo = obtenerMeses(contrato.inicioContrato, contrato.finContrato);
    segundoPeriodo = obtenerMeses(contrato.inicioContrato2, contrato.finContrato2)+primerPeriodo;
    tercerPeriodo = obtenerMeses(contrato.inicioContrato3, contrato.finContrato3)+segundoPeriodo;
    cuartoPeriodo = obtenerMeses(contrato.inicioContrato4, contrato.finContrato4)+tercerPeriodo;

    var costoAlquiler;
    for (i = 1; i <= contrato.duracionMeses; i++) {
        importeCuota = 0;

        if (esPrimero) {
            importeCuota = parseFloat(contrato.comisionInmobiliaria) / 2 + parseFloat(contrato.sellado) / 2 + parseFloat(contrato.costoAlquiler);
            esPrimero = false;
            fechaVencimientoCuota = moment(contrato.inicioContrato).add(10, 'days').toDate();


        } else {
            if (i <= primerPeriodo) {
                importeCuota = parseFloat(contrato.costoAlquiler);
            } else {
                if (i > primerPeriodo && i <= segundoPeriodo) {
                    importeCuota = parseFloat(contrato.costoAlquiler2);
                } else {
                    if (i > segundoPeriodo && i <= tercerPeriodo) {
                        importeCuota = parseFloat(contrato.costoAlquiler3);
                    } else {
                        importeCuota = parseFloat(contrato.costoAlquiler4);
                    }
                }
            }

            fechaVencimientoCuota = moment(fechaVencimientoCuota).add(1, 'months').toDate();
        }

        cupon = {
            contrato: id,
            periodo: i,
            importe: importeCuota,
            fechaVencimiento: fechaVencimientoCuota,
            pagado: false,


        }

        console.log(cupon);
        CuponesPagos.insert(cupon);
        quitarSaldo(contrato.inquilino, cupon.importe);

    }
    console.log("Finalizado la generaciones de cupones");


}
///Calcula los meses con el costo del periodo
function calcularPeriodo(inicio, fin, costoPeriodo) {
    var anioInicio = inicio.getFullYear();
    var anioFin = fin.getFullYear();

    var mesInicio = inicio.getMonth() + 1;
    var mesFin = fin.getMonth() + 1;

    var total = ((anioFin - anioInicio) * 12 + (mesFin - mesInicio)) * parseFloat(costoPeriodo);
    return total;
}

//calcula la cantidad de meses entre dos periodos
function obtenerMeses(inicio, fin) {
    var anioInicio = inicio.getFullYear();
    var anioFin = fin.getFullYear();

    var mesInicio = inicio.getMonth() + 1;
    var mesFin = fin.getMonth() + 1;

    return (((anioFin - anioInicio) * 12 + (mesFin - mesInicio)));
}
///Funcion que devuelve la cantidad de meses del contrato
function cantidadMeses(contrato) {

    var meses1 = obtenerMeses(contrato.inicioContrato, contrato.finContrato);
    

    var meses2 = obtenerMeses(contrato.inicioContrato2, contrato.finContrato2);
   

    var meses3 = obtenerMeses(contrato.inicioContrato3, contrato.finContrato3);
   

    var meses4 = obtenerMeses(contrato.inicioContrato4, contrato.finContrato4);
   
    return (meses1 + meses2 + meses3 + meses4);

}

///Verifica la existencia de un contrato unico
function verificarContrato(contrato) {
    /*Tiene que existir un contrato, con la misma propiedad y en la misma fecha de vigencia.
       Esto quiere decir que la fecha de inicio que le paso, no debe ser inferior que la fecha de fin de contrato de algun contrato.
       $lte menores o iguales que
       $lt valores menores que
       $gt valores mayores que
       $gte  valores mayores e iguales que       */

    //si encuentro una propiedad que tenga contrato que comience dentro del intervalo
    //Agregar esto a un funcion que valide la existencia unica de un contrato
    var valido = false;

    c1 = Contratos.findOne({ "propiedad": contrato.propiedad, $and: [{ "inicioContrato": { $gte: contrato.inicioContrato } }, { "finContrato": { $lte: contrato.inicioContrato } }] });
    c2 = Contratos.findOne({ "propiedad": contrato.propiedad, $and: [{ "finContrato": { $gte: contrato.finContrato } }, { "finContrato": { $lte: contrato.finContrato } }] });

    if (c1) {
        var fechaBInicioContrato = contrato.inicioContrato.getDay() + "/" + String(contrato.inicioContrato.getMonth() + 1) + "/" + contrato.inicioContrato.getFullYear();
        var fechasInicioContrato = c1.inicioContrato.getDay() + "/" + String(c1.inicioContrato.getMonth() + 1) + "/" + c1.inicioContrato.getFullYear();
        var fechasFinContrato = c1.finContrato.getDay() + "/" + String(c1.finContrato.getMonth() + 1) + "/" + c1.finContrato.getFullYear();

        throw new Meteor.Error("Contrato", "Existe un contrato vigente con esa fecha, la fecha de inicio intercepta=" + fechaBInicioContrato
            + " con el contrato vigente:" + fechasInicioContrato + " a " + fechasFinContrato);
    }
    if (c2) {
        var fechaBFinContrato = contrato.finContrato.getDay() + "/" + String(contrato.finContrato.getMonth() + 1) + "/" + contrato.finContrato.getFullYear();
        var fechasInicioContrato = c2.inicioContrato.getDay() + "/" + String(c2.inicioContrato.getMonth() + 1) + "/" + c2.inicioContrato.getFullYear();
        var fechasFinContrato = c2.finContrato.getDay() + "/" + String(c2.finContrato.getMonth() + 1) + "/" + c2.finContrato.getFullYear();

        throw new Meteor.Error("Contrato", "Existe un contrato vigente con esa fecha! la fecha de fin intercepta=" + fechaBFinContrato
            + " con el contrato vigente:" + fechasInicioContrato + " a " + fechasFinContrato);
    }
    if (!(c1 && c2)) { // si no hubo errores
        valido = true;
    }

    return valido;


}
/*Definición de constantes

*/

const IMPSELLADO = 0.012 //SIENDO EL 1.2%
const IMPPAGARE = 0.012 //siendo el 1.2%
Meteor.methods({
    'contratos.remove'(contratoId) {
        check(contratoId, String);
        Contratos.remove(contratoId);
        CuponesPagos.remove({ contrato: contratoId });
    },
    'contratos.insert'(contrato) {
        console.log("Insetando contrato");
        var valido = verificarContrato(contrato);

        if (valido) {
            contratoPeriodo1 = calcularPeriodo(contrato.inicioContrato, contrato.finContrato, contrato.costoAlquiler);
            contratoPeriodo2 = calcularPeriodo(contrato.inicioContrato2, contrato.finContrato2, contrato.costoAlquiler2);
            contratoPeriodo3 = calcularPeriodo(contrato.inicioContrato3, contrato.finContrato3, contrato.costoAlquiler3);
            contratoPeriodo4 = calcularPeriodo(contrato.inicioContrato4, contrato.finContrato4, contrato.costoAlquiler4);

            contratoTotal = contratoPeriodo1 + contratoPeriodo2 + contratoPeriodo3 + contratoPeriodo4;
            contratoTotal = parseFloat(contrato.comisionInmobiliaria) + parseFloat(contratoTotal);

            //sino se define el sellado se rellena de forma automatica siendo el 1,2%
            if (!contrato.sellado) {
                contrato.sellado = (IMPSELLADO * contratoTotal);
            }
            //sino se define el impPagare se calcula
            if (!contrato.impPagare) {
                contrato.impPagare = contrato.pagare * IMPPAGARE; //Pagaré 1,2 % del monto del pagaré, firma el garante.
            }

            contrato.contratoTotal = contratoTotal;

            contrato.duracionMeses = cantidadMeses(contrato);

            idContrato = Contratos.insert(contrato);
            generarCuponesDePagos(contrato, idContrato);
            /* No se devuelve el deposito, dado que se utiliza en la entrega de llaves
            if (contrato.depositoGarantia) {
                agregarSaldo(contrato.inquilino, contrato.depositoGarantia);
            }
            */
        }
    }

});


export const ContratosIndex = new EasySearch.Index({
    collection: Contratos,
    fields: ['propiedad', 'inquilino', 'garante'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions: { limit: 10 }

});
