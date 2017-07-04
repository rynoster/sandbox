
exports.up = function(knex, Promise) {
  return knex.schema.alterTable("users", function(table){
    table.string("pro_profile", 100).alter();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.dropColumn("pro_profile");
  });
};
