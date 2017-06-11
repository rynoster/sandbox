
exports.up = function(knex, Promise) {
  return knex.raw("\
    CREATE TABLE users ( \
    id int(11) unsigned NOT NULL AUTO_INCREMENT, \
    email varchar(50) NOT NULL DEFAULT '', \
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    event_profile varchar(15) DEFAULT 'Delegate', \
    first_name varchar(25) NOT NULL DEFAULT '', \
    last_name varchar(25) NOT NULL DEFAULT '', \
    last_edit datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP, \
    admin tinyint(1) DEFAULT '0', \
    pro_profile varchar(50) DEFAULT NULL, \
    dietary varchar(50) DEFAULT 'None', \
    password varchar(60) DEFAULT NULL, \
    company varchar(50) DEFAULT NULL, \
    mobilenr varchar(15) DEFAULT NULL, \
    officenr varchar(15) DEFAULT NULL, \
    token text, \
    valid_until datetime DEFAULT NULL, \
    verified tinyint(1) DEFAULT '0', \
    PRIMARY KEY (id) \
    ) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1; \
  ")
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
