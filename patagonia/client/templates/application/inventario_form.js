
AutoForm.hooks({
    agregarInventario: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) { console.log("Onsubmit") },
        onSuccess: function (formType, result) { console.log("onSuccess") },
        onError: function (formType, error) { console.log("OnError:" + error) },
        beginSubmit: function () { console.log("beginSubmit") },
        endSubmit: function () { console.log("endSubmit") },
        // before: {
        //     // Replace `formType` with the form `type` attribute to which this hook applies
        //     insert: function (doc) {
        //         // Potentially alter the doc
        //         console.log(doc);

        //         // Then return it or pass it to this.result()
        //         //return doc; (synchronous)
        //         //return false; (synchronous, cancel)
        //         //this.result(doc); (asynchronous)
        //         //this.result(false); (asynchronous, cancel)
        //     }
        // },
    }
});

