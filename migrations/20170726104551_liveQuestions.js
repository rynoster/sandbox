
exports.up = function(knex, Promise) {
  return knex.raw("\
    CREATE TABLE liveQuestions ( \
        id int(11) unsigned NOT NULL AUTO_INCREMENT, \
        dateStamp datetime DEFAULT NULL, \
        question text, \
        PRIMARY KEY (id) \
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1; \
  ");
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
