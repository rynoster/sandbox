
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("parkingSent").defaultTo(0).notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("parkingSent");
  });
};
