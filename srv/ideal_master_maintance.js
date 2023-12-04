const cds = require("@sap/cds");
const dbClass = require("sap-hdbext-promisfied");
const hdbext = require("@sap/hdbext");
const LV_Handler = require('../srv/LIB/ErrorHandler');

module.exports = cds.service.impl(async function(){

    var client = await dbClass.createConnectionFromEnv();  
    var dbconn = new dbClass(client);

    this.on('UserMasterCrud',async (req) => {

        var LV_Action = req.data.Action;
        var LV_Role = req.data.input[0].USER_ROLE;
        var LV_Company_code = req.data.input[0].COMPANY_CODE;
        var LV_User_Id = req.data.input[0].USER_ID;
          
          if(LV_Action === 'Post')
          {
            const sp = await dbconn.loadProcedurePromisified(hdbext,null,'USERMASTERCRUD');
            const output = await dbconn.callProcedurePromisified(sp,[LV_Action,LV_User_Id,LV_Company_code,LV_Role,req.data.input]);
            LV_Handler.Handler(req,'success',output.outputScalar.OUT_SUCCESS); 
          }
          if(LV_Action === 'Edit')
          {

            const sp = await dbconn.loadProcedurePromisified(hdbext,null,'USERMASTERCRUD');
            const output = await dbconn.callProcedurePromisified(sp,[LV_Action,LV_User_Id,LV_Company_code,LV_Role,req.data.input]);
            LV_Handler.Handler(req,'success',output.outputScalar.OUT_SUCCESS); 
          }
          if(LV_Action === 'Delete')
          {
            const sp = await dbconn.loadProcedurePromisified(hdbext,null,'USERMASTERCRUD');
            const output = await dbconn.callProcedurePromisified(sp,[LV_Action,LV_User_Id,LV_Company_code,LV_Role,req.data.input]);
            LV_Handler.Handler(req,'success',output.outputScalar.OUT_SUCCESS); 
          }

    })


})
