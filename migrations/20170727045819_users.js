
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("superAdmin").defaultTo(0).notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("superAdmin");
  });
};
