import { MysqlError } from "mysql";

/** Extended MysqlError */
export default interface MySQLError extends MysqlError {
    /** Error explanation */
    kind: string;
}
