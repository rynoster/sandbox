
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("passwordSent").defaultTo(0).notNullable();
    table.boolean("passwordChanged").defaultTo(0).notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("passwordSent");
    table.boolean("passwordChanged");
  });
};
