const cds = require("@sap/cds");

    module.exports= {
    getEntityDesc:async function (connection, entityCode) {
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
    },
    generateSuccessMessage: function (aData) {
		var successMsg = '';
		if (aData.length > 0) {
			for (var j = 0; j < aData.length; j++) {
				if (j === 0) {
					successMsg = aData[j];
				} else if (j === aData.length - 1) {
					successMsg = successMsg + " and " + aData[j];
				} else {
					successMsg = successMsg + " , " + aData[j];
				}
			}
		}
		if (successMsg === "") {
			successMsg = 'No Changes Has Been Detected';
		} else {
			successMsg = successMsg + " Has Been Updated";
		}
		return successMsg
	},
    getTemplateColumns: async function (conn) {
		try {
			// var aResult = await SELECT .from `DEALER_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY`  .where `CCODE = 'TEMPLATE' AND TYPE = 1`;

			let aResult = await conn.run(
				SELECT
					.from`${conn.entities['DEALER_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
					.where`CCODE = 'TEMPLATE' AND TYPE = 1`
			);
			return aResult;
		}
		catch (error) {
			throw error;
		}
	}
}