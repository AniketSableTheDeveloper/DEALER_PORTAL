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
	},
	getApproverForEntity: async function (connection, sEntityCode, sRoleCode, sTableName, sType) {
        try {
            // let sApprover = null;
            let sTableFullName = 'DEALER_PORTAL.' + sTableName;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities[sTableFullName]}`
                    .where({ ENTITY_CODE: sEntityCode, ROLE_CODE: sRoleCode , TYPE: sType}));
            if (aResult.length > 0) return aResult;
            else return null;
            // sApprover = aResult[0].USER_ID;            
 
        }
        catch (error) { throw error; }
 
    },
	getRegisteredId:async function(iReqNo,connection){
        try {
            // let connection = await cds.connect.to('db');
            let aResult = await connection.run(
                SELECT `REGISTERED_ID`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where({ REQUEST_NO: iReqNo }));
            if (aResult.length > 0) return aResult[0].REGISTERED_ID;
            else return null;      
 
        }
        catch (error) { throw error; }
    },
}