import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Docs = new Mongo.Collection("docs");
Docs.attachSchema(new SimpleSchema({
  name: {
    type: String,
  },
  fileId: {
    type: String,
  }
}));

Files = new FS.Collection("files", {
  stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
  download: function () {
    return true;
  },
  fetch: null
});
