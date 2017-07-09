
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("cxoRSVP");
    table.boolean("allowCxoInvite");
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.dropColumn("cxoRSVP");
    table.dropColumn("allowCxoInvite");
  });
};
