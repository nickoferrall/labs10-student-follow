exports.up = function(knex, Promise) {
  return dropClassId().then(addTeacherId);

  function dropClassId() {
    return knex.schema.table('refreshrs', tbl => {
      tbl.dropColumn('class_id');
    });
  }

  function addTeacherId() {
    return knex.schema.table('refreshrs', tbl => {
      tbl
        .integer('teacher_id')
        .unsigned()
        .references('id')
        .inTable('teachers');
    });
  }
};

exports.down = function(knex, Promise) {
  return dropTeacherId().then(addClassId);

  function dropTeacherId() {
    return knex.schema.table('refreshrs', tbl => {
      tbl.dropColumn('teacher_id');
    });
  }

  function addClassId() {
    return knex.schema.table('refreshrs', tbl => {
      tbl
        .integer('class_id')
        .unsigned()
        .references('id')
        .inTable('classes');
    });
  }
};
