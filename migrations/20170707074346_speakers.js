
exports.up = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.string("profession", 100);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.dropColumn("profession");
  });
};
