const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
 
const lib_common = require('./LIB/ideal_library')
const lib_email = require('./LIB/ideal_library_email')
const lib_email_content = require('./LIB/ideal_library_email_content')
const connect = require('passport/lib/framework/connect')
const lib_mdg = require('./LIB/ideal_library_mdg')  
// const lib_ias = require('./LIB/iven_library_ias')

module.exports = cds.service.impl(function () {

this.on('checkServiceAvailability',async(req)=>{
 
    try{
        var {cloudSrv,onPremiseSrv} = req.data;
   
      var client = await dbClass.createConnectionFromEnv();
      var dbConn = new dbClass(client);
      // var {sapClient,destFileName} = req.data;
      var response = {"onPremiseSrv":null,"cloudSrv":null};
      var sapClient ='';
   
      if(onPremiseSrv){
      //   set connection to ZIDL_CUSTOMER_REG_SRV Destination
      var iDealDistConnection = await cds.connect.to('ZIDL_CUSTOMER_REG_SRV');
      var onPremResponse = await iDealDistConnection.send({
        method: 'GET',
        path:'/BPTypeSet',
        headers: { 'Content-Type': 'application/json' ,
        "sap-client":sapClient
      }
      })
      if( onPremResponse.length >= 0)
        response.onPremiseSrv = "Loaded"
   
    }
    if(cloudSrv){
      var connection = await cds.connect.to('db');
      var cloudResponse =  await connection.run(SELECT
        .from`${connection.entities['DEALER_PORTAL.MASTER_SUBACCOUNT']}`);
   
        if( cloudResponse.length >= 0)
        response.cloudSrv = "Loaded"
   
      }
   req.reply(response);  
  }
  catch(error)
  {
    req.error({ code: "500", message:  error.message ? error.message : error });  
    // throw error;
  }    
  })

  this.on('S4HANA_Testing',async (req)=>{

    var { action, inputData,addressData,contactsData,bankData, eventsData,userDetails } = req.data;

        var sUserIdentity=userDetails.USER_ID || null;
        var sUserRole=userDetails.USER_ROLE || null;
        var client = await dbClass.createConnectionFromEnv();
        let dbConn = new dbClass(client);
        var connection = await cds.connect.to('db');

        var iReqNo = inputData[0].REQUEST_NO || null;
        var sEntityCode = inputData[0].ENTITY_CODE || null;
        var iRequestType = inputData[0].REQUEST_TYPE || null;
        var sSupplierEmail = inputData[0].REGISTERED_ID || null;
        // var sUserId = eventsData[0].USER_ID || null;
        var iLevel = inputData[0].APPROVER_LEVEL || null;
        var sBuyerEmail = inputData[0].REQUESTER_ID || null;
        var sIvenNo = inputData[0].IDEAL_DIST_CODE || null;
        var sSupplerName = inputData[0].DIST_NAME1 || null;
        var sChangeRequestNo = null;
        var iDealDistCode = inputData[0].IDEAL_DIST_CODE;
        var sCompareValue = "A";

        if(action === 'Testing')
        {
        oMDGPayload =await lib_mdg.getMDGPayload(inputData,addressData,contactsData,bankData, connection);
        iDealDistCode = inputData[0].IDEAL_DIST_CODE;

    // ------------------------START: Direct MDG Call for testing-------------------------
        var MDGResult =await lib_mdg.PostToMDG(oMDGPayload,connection);

        iMDGStatus = MDGResult.iStatusCode;
        oMDGResponse = MDGResult.oResponse;

        sChangeRequestNo =oMDGResponse.changerequestNo;
        sSapVendorCode = parseInt(oMDGResponse.d.Lifnr, 10) || "";
        var responseObj = {
          "Message": "Success",
          "MDG_status": iMDGStatus,
          "MDG_Payload": oMDGPayload,
          "ODataResponse": oMDGResponse,
          "sChangeRequestNo": sChangeRequestNo,
          "sChangeRequestNo1": sChangeRequestNo
        };
        return  responseObj;
        }
  })
})