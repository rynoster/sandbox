
exports.up = function(knex, Promise) {
  return knex.schema.table("agenda", function(table){
    table.integer("scanId");
    table.dateTime("scanSendTime");
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("agenda", function(table){
    table.dropColumn("scanId");
    table.dropColumn("scanSendTime");
  });
};
