-- Author: Oskari Saarinen
-- Date: 2022-01-09
-- File: persons.sql

SET @@auto_increment_increment=1;

DROP TABLE IF EXISTS PERSONS;
DROP TABLE IF EXISTS persons;

CREATE TABLE persons
(
    id          INTEGER         NOT NULL    PRIMARY KEY     AUTO_INCREMENT
    , fname     VARCHAR(100)    NOT NULL
    , lname     VARCHAR(100)    NOT NULL
    , age       INTEGER         NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ALTER TABLE persons AUTO_INCREMENT = 1;

-- End of file
