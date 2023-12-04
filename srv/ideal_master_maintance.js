const cds = require("@sap/cds");
const dbClass = require("sap-hdbext-promisfied");
const hdbext = require("@sap/hdbext");
// const LV_Handler = require('../srv/LIB/ErrorHandler');
// const lib_common = require('./LIB/ideal_library')


module.exports = cds.service.impl(async function(){

    var client = await dbClass.createConnectionFromEnv();  
    var dbconn = new dbClass(client);

    this.on('PostUserMaster',async (req) => {
        try {
            // local variables
            var oReqData = req.data.input;
            var oUserDetails=oReqData.USER_DETAILS;
            var sUserId=oUserDetails.USER_ID || null;
            var sUserRole=oUserDetails.USER_ROLE || null;
            var sAction = oReqData.ACTION;
            var aUserData = oReqData.VALUE[0].USERMASTER;
            var aEntityData = oReqData.VALUE[0].ENTITYDATA;
            var bIsDuplicateUser = null;

            if (sAction === "CREATE") {
                // Check Duplicate User
                bIsDuplicateUser = await _checkDuplicateUser(aUserData);
              }
            if (!bIsDuplicateUser || (sAction === "UPDATE" || sAction === "DELETE")) {
                // load procedure
                const loadProc = await dbconn.loadProcedurePromisified(hdbext, null, 'MASTER_IDEAL_USERS')
                console.log(oReqData);
                // excute procedure
                const result = await dbconn.callProcedurePromisified(loadProc,[sAction, aUserData, aEntityData]);
                return result;
              }   
              else {
                return "This user already exist.";        
              }   
            } catch (error) {
              var sType=error.code?"Procedure":"Node Js";    
              var iErrorCode=error.code??500;     
              // let Result2 = {
              //   OUT_SUCCESS: error.message || ""
              // };
              let Result = {
                  OUT_ERROR_CODE: iErrorCode,
                  OUT_ERROR_MESSAGE:  error.message ? error.message : error
              }
            //   lib_common.postErrorLog(Result,null,sUserId,sUserRole,"User Master",sType,dbConn,hdbext);
              console.error(error)         
              req.error({ code:iErrorCode, message:  error.message ? error.message : error });      
            }   
          });
    });
    // this.on('PostRequestApprovalMatrix',async (req) => {
    //   try {


    //   }
    //     catch (error) { 
    //       var iErrorCode=error.code??500;     
    //       console.error(error)         
    //       req.error({ code:iErrorCode, message:  error.message ? error.message : error });      
    //     } 
    // });  
    async function _checkDuplicateUser(data) {
        try {
          //Connection to database
          let connection = await cds.connect.to('db');
          queryResult = await connection.run(SELECT.from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_USERS']}`
            .where`EMAIL = ${data[0].EMAIL} AND ACTIVE = 'X'`);
          if (queryResult.length === 0) {
            return false;
          } else {return true;}
        }
        catch (error) {throw error;}
      }
