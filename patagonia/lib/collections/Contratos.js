import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { moment } from 'meteor/momentjs:moment';




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
        label: "Costo del alquiler mensual",
        min: 0,
        autoform: {
            placeholder: "Ingrese el alquiler. Ej 4950.95",
            step: 0.01,
        }
    },
    inicioContrato: {
        type: Date,
        label: "Inicio del contrato",
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del comienzo del período'
        }
    },
    finContrato: {
        type: Date,
        label: "Fin de contrato",
        autoform: {
            type: 'date',
            placeholder: 'Ingrese la fecha del fin del período'
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
        autoform: {
            placeholder: "Ingrese el monto del pagaré. Ej: 1234",
            step: 0.001,
        }
    },
    impPagare: {
        type: Number,
        label: "Impuesto pagaré",
        optional: true,
        autoform: {
            placeholder: "Calculado",
            step: 0.001,
        }

    },
    multaSellado: {
        type: Number,
        label: "Multa de sellado",
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
        optional: true,
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


function generarCuponesDePagos(contrato, id) {
    console.log("Generando cupones de pago");
    console.log(contrato);
    var esPrimero = true;
    fechaVencimientoCuota = [];
    for (i = 1; i <= contrato.duracionMeses; i++) {
        importeCuota = 0;

        if (esPrimero) {
            importeCuota = parseFloat(contrato.comisionInmobiliaria) / 2 + parseFloat(contrato.sellado) / 2 + parseFloat(contrato.costoAlquiler);
            esPrimero = false;
            fechaVencimientoCuota = moment(contrato.inicioContrato).add(10, 'days').toDate();


        } else {
            importeCuota = parseFloat(contrato.costoAlquiler);
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
    }
    console.log("Finalizado la generaciones de cupones");


}
function agregarGarantia(idPersona, garantia) {
    persona = Personas.findOne({ cuit: idPersona });
    if (persona) {
        console.log("Garantía agregada");

        Personas.remove(persona._id);
        persona.saldo = garantia;

        Personas.insert(persona);
        console.log(persona);
    }
}
Meteor.methods({
    'contratos.remove'(contratoId) {
        check(contratoId, String);
        Contratos.remove(contratoId);
        CuponesPagos.remove({ contrato: contratoId });
    },
    'contratos.insert'(contrato) {
        /*Tiene que existir un contrato, con la misma propiedad y en la misma fecha de vigencia.
        Esto quiere decir que la fecha de inicio que le paso, no debe ser inferior que la fecha de fin de contrato de algun contrato.
        $lte menores o iguales que
        $lt valores menores que
        $gt valores mayores que
        $gte  valores mayores e iguales que       */

        //si encuentro una propiedad que tenga contrato que comience dentro del intervalo
        if (contrato.inicioContrato >= contrato.finContrato) {
            throw new Meteor.Error("Contrato", "La fecha de inicio no puede ser superior a la fecha de fin de contrato");
        }
        c1 = Contratos.findOne({ "propiedad": contrato.propiedad, $and: [{ "inicioContrato": { $lte: contrato.inicioContrato } }, { "finContrato": { $gte: contrato.inicioContrato } }] });
        c2 = Contratos.findOne({ "propiedad": contrato.propiedad, $and: [{ "finContrato": { $lte: contrato.finContrato } }, { "finContrato": { $gte: contrato.finContrato } }] });
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
        var costoAlquilerMensual = contrato.costoAlquiler;
        var anioInicio = contrato.inicioContrato.getFullYear();
        var anioFin = contrato.finContrato.getFullYear();

        var mesInicio = contrato.inicioContrato.getMonth() + 1;
        var mesFin = contrato.finContrato.getMonth() + 1;

        var contratoTotal = ((anioFin - anioInicio) * 12 + (mesFin - mesInicio)) * costoAlquilerMensual;
        contratoTotal = parseFloat(contrato.comisionInmobiliaria) + parseFloat(contratoTotal);
        //sino se define el sellado se rellena de forma automatica
        if (!contrato.sellado) {
            contrato.sellado = (0.012 * contratoTotal);
        }
        contrato.impPagare = contrato.pagare * 0.012; //Pagaré 1,2 % del monto del pagaré, firma el garante.


        contrato.contratoTotal = contratoTotal;
        contrato.duracionMeses = ((anioFin - anioInicio) * 12 + (mesFin - mesInicio));
        idContrato = Contratos.insert(contrato);
        generarCuponesDePagos(contrato, idContrato);
        if (contrato.depositoGarantia) {
            agregarGarantia(contrato.inquilino, contrato.depositoGarantia);
        }



    }

});


export const ContratosIndex = new EasySearch.Index({
    collection: Contratos,
    fields: ['propiedad', 'inquilino', 'garante'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions: { limit: 10 }

});
