const cds = require("@sap/cds");

    exports.getEntityDesc = async function (connection, entityCode) {
    try {
        var response = "";
        // let connection = await cds.connect.to('db');
        let queryResult = await connection.run(SELECT`BUTXT`.from`${connection.entities['DEALER_PORTAL.MASTER_ENTITY_CODE']}`
            .where`BUKRS = ${entityCode}`);
        if (queryResult.length > 0)
            response = queryResult[0].BUTXT
        return response;
    }
    catch (error) { throw error; }
    }