
exports.up = function(knex, Promise) {
  return knex.raw(" \
    CREATE TABLE sessionRatings ( \
        id int(11) unsigned NOT NULL AUTO_INCREMENT, \
        sessionId int(11) NOT NULL, \
        content int(11) DEFAULT NULL, \
        presenter int(11) DEFAULT NULL, \
        experience int(11) DEFAULT NULL, \
        room int(11) DEFAULT NULL, \
        staff int(11) DEFAULT NULL, \
        comment text, \
        PRIMARY KEY (id) \
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1; \
  ");
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("sessionRatings");
};
