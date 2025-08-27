/**
 * parseSequelizeError.util.js
 * تحويل أخطاء Sequelize إلى رسائل واضحة وقابلة للاستخدام في Services/Controllers
 */

function parseSequelizeError(error) {
    switch (error.name) {

        // ===== Validation Errors =====
        case "SequelizeValidationError":
            return {
                type: "ValidationError",
                message: "Errors:\n" + error.errors.map(e => e.message).join("\n"),
                details: error.errors
            };

        case "SequelizeUniqueConstraintError":
            return {
                type: "UniqueConstraintError",
                message: "Errors:\n" + error.errors.map(e => e.message).join("\n"),
                details: error.errors
            };

        case "SequelizeForeignKeyConstraintError":
            return {
                type: "ForeignKeyConstraintError",
                message: `Invalid foreign key: ${error.index || error.fields}`,
                details: error
            };

        case "SequelizeExclusionConstraintError":
            return {
                type: "ExclusionConstraintError",
                message: error.message,
                details: error
            };

        case "SequelizeOptimisticLockError":
            return {
                type: "OptimisticLockError",
                message: "Record has been modified by another transaction",
                details: error
            };

        case "SequelizeEagerLoadingError":
            return {
                type: "EagerLoadingError",
                message: "Invalid include or association in query",
                details: error
            };

        case "SequelizeScopeError":
            return {
                type: "ScopeError",
                message: `Scope "${error.scope}" does not exist on model`,
                details: error
            };

        case "SequelizeAggregateError":
            return {
                type: "AggregateError",
                message: "Invalid aggregate function or field",
                details: error
            };

        // ===== Database & Connection Errors =====
        case "SequelizeDatabaseError":
            return {
                type: "DatabaseError",
                message: error.message,
                details: error
            };

        case "SequelizeConnectionError":
            return {
                type: "ConnectionError",
                message: "Database connection failed",
                details: error
            };

        case "SequelizeConnectionRefusedError":
            return {
                type: "ConnectionRefusedError",
                message: "Connection refused by database",
                details: error
            };

        case "SequelizeConnectionTimedOutError":
            return {
                type: "ConnectionTimedOutError",
                message: "Database connection timed out",
                details: error
            };

        case "SequelizeTimeoutError":
            return {
                type: "TimeoutError",
                message: "Query execution timed out",
                details: error
            };

        // ===== Default case =====
        default:
            return {
                type: "UnknownError",
                message: error.message || "An unexpected error occurred",
                details: error
            };
    }
}

module.exports = { parseSequelizeError };