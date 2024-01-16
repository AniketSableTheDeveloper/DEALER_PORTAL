const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email') 
const lib_email_content = require('../srv/LIB/ideal_library_email_content')

module.exports = cds.service.impl(function () {

    this.on('PostRegFormData', async (req) => {
    //Changes By Chandan M 23/11/23 Start
    var client = await dbClass.createConnectionFromEnv();
    var dbConn = new dbClass(client);
    //Changes By Chandan M 23/11/23 End
    try {
        var {
            action,
            appType,
            stepNo,
            reqHeader,
            addressData,
            contactsData,
            bankData,
            // financeData,
            // ownersData,
            // prodServData,
            // capacityData,
            promotersData,
            customerData,
            businessHistoryData,
            // oemData,
            // discFieldsData,
            // discRelativesData,
            // discQaCertiData,
            attachmentFieldsData,
            attachmentData,
            updatedFields,
            eventsData,
            userDetails
        } = req.data;

        var sAction = action;
        var Result = null;
        var sType = appType;


    //intialize connection to database
    var connection = await cds.connect.to('db');
    var isEmailNotificationEnabled = false;
    var sUserIdentity=userDetails.USER_ID || null;
    var sUserRole=userDetails.USER_ROLE || null;

   //Check if email notification is enabled
   isEmailNotificationEnabled = await lib_common.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

    if (sAction === "DRAFT" || sAction === "CREATE" || sAction === "RESEND") { 

        var iReqNo = reqHeader[0].REQUEST_NO;
        var iReqType = reqHeader[0].REQUEST_TYPE;
        var iStep = stepNo;
        var sLevel = reqHeader[0].APPROVER_LEVEL || 1;
        
        // --Section 2--
        var aMainObj = reqHeader;
        if (aMainObj.length > 0) {
            reqHeader[0].REQUEST_NO = 0;
        } else {
            throw "Invalid Payload";
        }
        var sUserId = reqHeader[0].REGISTERED_ID;
        var sEntityCode = reqHeader[0].ENTITY_CODE;
        var sIsResend = reqHeader[0].REQUEST_RESENT;
        var iStatus = 4; // Draft - in progress
        var distributorName = reqHeader[0].DIST_NAME1;
        

        // iREG_NO = iReqNo || null;
        // sUser_ID = aMainObj[0].REGISTERED_ID || null;

        var aAddressObj = await getidForArr(addressData, "SR_NO") || [];
        var aContactObj = await getidForArr(contactsData, "SR_NO") || [];

        // --Section 2--
        var aBankObj = await getidForArr(bankData, "SR_NO") || [];
        // var aFinanceObj = await getidForArr(financeData, "SR_NO") || [];
        // var aOwnerObj = await getidForArr(ownersData, "SR_NO") || [];

        // --Section 3--
        // var aProdServPayloadObj = await getProdServiceData(prodServData, "SR_NO") || [];
        // var aProductObj = aProdServPayloadObj.Products || [];
        // var aServiceObj = aProdServPayloadObj.Service || [];
        // var aProdServbj = [...aProductObj, ...aServiceObj];

        // var aCapacityObj = await getidForArr(capacityData, "SR_NO") || [];
        var aPromoters = await getidForArr(promotersData, "SR_NO") || [];
        var aCustomerObj = await getidForArr(customerData, "SR_NO") || [];
        var aBusniessHistory = await getidForArr(businessHistoryData, "SR_NO") || [];
        // var aOEMObj = await getidForArr(oemData, "SR_NO") || [];

        // --Section 4--
        // var aDiscFieldsObj = discFieldsData || [];
        // if (aDiscFieldsObj.length > 0) {
        //     aDiscFieldsObj[0].REQUEST_NO = 0;
        // }
        // var aRelativeObj = await getidForArr(discRelativesData, "SR_NO") || [];
        // var aQaCertiObj = await getidForArr(discQaCertiData, "SR_NO") || [];

        // --Section 5--
        var aAttachFieldsObj = attachmentFieldsData || [];
        if (aAttachFieldsObj.length > 0) {
            aAttachFieldsObj[0].REQUEST_NO = 0;
        }
        var aAttachmentsObj = await getidForArr(attachmentData, "SR_NO") || [];

        var aUpdatedFieldsIDs = updatedFields;
        var aUpdatedFieldsObj = [];
        if (aUpdatedFieldsIDs.length > 0) {
            aUpdatedFieldsObj = await lib_common.getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) || [];
        }

        var aEventsObj = eventsData || [];        

        const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_DRAFT_SUBMIT');
        sResponse = await dbConn.callProcedurePromisified(loadProc,
            [iReqNo, iReqType, iStep, sEntityCode, sUserId, sIsResend, iStatus,null,
                aMainObj, aAddressObj, aContactObj,
                aBankObj,
                aBusniessHistory,aCustomerObj,aPromoters,
                aAttachFieldsObj, aAttachmentsObj,aUpdatedFieldsObj, aEventsObj
            ]
        );

        Result = sResponse.outputScalar;
        //Create response message
        var Message =null;
        if(Result.OUT_SUCCESS !== null){
        if(sAction === "DRAFT")
            Message = "Draft saved successfully";
        else if(sAction === "CREATE")
            Message = "Registration Form Submitted for Request: "+ iReqNo +". Your form will be forwarded to Procurement Team for verification.";
        else if(sAction === "RESEND")
            Message ="Form resent successfully";
        
            var oEmailData = {
                "ReqNo": iReqNo,
                "SupplierName": distributorName,
                "To_Email": Result.OUT_EMAIL_TO // Approver
            };
            var checkSupplier =await fnCheckSupplier(connection, oEmailData.ReqNo);
            if (checkSupplier === null) {
                var dataApprover = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'CALC_HIERARCHY_MATRIX',sType,sLevel) || "";
                var sRoleCode = dataApprover[0].ROLE_CODE || null;
                sLevel = dataApprover[0].LEVEL || 1;
                sPmId = await lib_common.getApproverForEntity(connection, sEntityCode, sRoleCode, 'CALC_HIERARCHY_MATRIX',sType,sLevel) || "";
                // var sPMId = await lib_common.getApproverForEntity(connection, sEntityCode, 'PM', 'MATRIX_REGISTRATION_APPR') || "";
                if (sPmId !== "") sPmId = sPmId[0].USER_IDS;
                oEmailData.To_Email = sPmId;

                if (sAction === "CREATE") {
                    var status = 5;
                } else if (sAction === "RESEND") {
                    var status = 9;
                }
                if (isEmailNotificationEnabled && sAction !== 'DRAFT' && sPMId !== null ) {
                    var oEmaiContent = await lib_email_content.getEmailContent(connection, "SELFREG", "REGISTER", oEmailData, status);
                    var sCCEmail = await lib_email.setSampleCC( null);
                    await  lib_email.sendidealEmail(sPMId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                
                }
            } else {
                if (isEmailNotificationEnabled && sAction !== 'DRAFT' && oEmailData.To_Email !== null) {
                    var oEmaiContent = await lib_email_content.getEmailContent(connection,sAction, "REGISTER", oEmailData, null);
                    var sCCEmail = await lib_email.setSampleCC( null);
                    await  lib_email.sendidealEmail(oEmailData.To_Email,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
            }
            responseObj = {
                "Draft_Success": Result.OUT_SUCCESS !== null ? 'X' : '',
                "REQUEST_NO": Result.OUT_SUCCESS !== null ? iReqNo : 0,
                // "Message": Result.OUT_SUCCESS !== null ? "Draft saved successfully" : "Draft saving failed!",
                "Message":Message,
                "ERROR_CODE": Result.OUT_ERROR_CODE,
                "ERROR_DESC": Result.OUT_ERROR_MESSAGE
            };
            req.reply(responseObj);
        } 
        else{
            Message = "Process Failed"
        }
    }
    else {
        throw { message: "The value for action is invalid" };
    }
        } catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            // lib_common.postErrorLog(Result,iReqNo,sUserIdentity,sUserRole,"Vendor Registration Form",sType,dbConn,hdbext);       
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })
    async function fnCheckSupplier(connection, requestNo) {
        var value = 0;
        let aResult = await connection.run(
            SELECT
                .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                .where({ REQUEST_NO: requestNo })
        );
        if (aResult[0].REQUESTER_ID === null && aResult[0].DIST_CODE === "SR") {
            value = null;
        }
        return value;
    }
    async function getidForArr(array, propertyName) {
        if (array.length > 0) {
            if (propertyName !== "" && propertyName !== null && propertyName !== undefined) {
                for (var i = 0; i < array.length; i++) {
                    array[i].REQUEST_NO = 0;
                    array[i][propertyName] = i + 1;
                }
            } else {
                throw "Property Name missing for id's"
            }
        }
        return array;
    }
    this.on('ManageCMS', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client); 
        try {
        var { action,attachmentId, inputData,userDetails } = req.data;
        var sUserIdentity=userDetails.USER_ID || null;
        var sUserRole=userDetails.USER_ROLE || null;
        var aCMSData = inputData || [];
        var Result, responseObj;

        var iReqNo=attachmentId.REQUEST_NO||null;

        // get connection
        if (aCMSData.length > 0) {
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CMS_OPERATIONS');
            Result = await dbConn.callProcedurePromisified(loadProc,[action,attachmentId.REQUEST_NO,attachmentId.SR_NO,attachmentId.DOC_ID, aCMSData]);

            if (Result.outputScalar.OUT_SUCCESS !== null) {
                responseObj = {
                    "Message": Result.outputScalar.OUT_SUCCESS,
                    "DocID": Result.outputScalar.OUT_DOC_ID
                };

                req.reply(JSON.stringify(responseObj));
            }
            else {   
                responseObj = {
                    "Message": "CMS operation for " + action + " failed!",
                    "DocId": Result.outputScalar.OUT_DOC_ID,
                    "ERROR_CODE": parseInt(Result.outputScalar.OUT_ERROR_CODE),
                    "ERROR_DESC": Result.outputScalar.OUT_ERROR_MESSAGE
                };
                throw JSON.stringify(responseObj);
            }
        }
        else throw "Input data missing for action."
        } catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,iReqNo,sUserIdentity,sUserRole,"Distributor Registration Form",sType,dbConn,hdbext);
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })

    this.on('GetDraftData', async (req) => {
        try {
            //local Variables   
            var { requestNo, entityCode, creationType,userRole,userId } = req.data;
            var oCcodeRType = null,
            sUserID = null,
            sTypeDesc = null;
        
            let connection = await cds.connect.to('db');
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);

            //fetch registered id against request no
            var registeredUser = await lib_common.getRegisteredId(requestNo,connection);

            // try {
            if (entityCode === undefined || entityCode === null || entityCode === "" || creationType === undefined || creationType === null || creationType === "") {

                oCcodeRType = await getCcodeRType(connection, requestNo, "REQUEST_INFO");

                entityCode = oCcodeRType.EntityCode;
                creationType = oCcodeRType.CreationType;
                sTypeDesc = oCcodeRType.RequestTypeDesc;
            }

            if (entityCode === null || entityCode === "" || entityCode === undefined) {
                throw "Entity Code missing";
            }
            else if(creationType === null || creationType === "" || creationType === undefined){
                throw "Creation Type Missing"
            }
            else {

                var aDraftData = await getDraftData(connection, requestNo);
                if (aDraftData.MAIN.length > 0) {
                    sUserID = aDraftData.MAIN[0].REGISTERED_ID || null;
                }

                var aMandatoryFieldsData = await getMandatoryVisibleFieldsData(connection, entityCode, creationType,'M');
                var aVisibleFieldsData = await getMandatoryVisibleFieldsData(connection, entityCode, creationType,'V');
                var aUpdatedFieldsData = await getUpdatedFieldsData(connection, requestNo);
                var aSettings = await getObjectFromRows(await getiDealSettings(connection));
                // Total Count of Mandatory Fields For Progress Bar
                var obj1 = aMandatoryFieldsData[0] || {};
                var totalCount = 0;
                var key;
                if (Object.keys(obj1).length) {
                    for (key in obj1) {
                        if (obj1[key] === "X") {
                            totalCount = totalCount + 1;
                        }
                    }
                }
                var responseObj = {
                    "DRAFT": (aDraftData.MAIN.length || aDraftData.ADDRESS.length) > 0 ? aDraftData : [], // changes to save country from registration form 10/04/2023
                    "VISIBLE": aVisibleFieldsData.length > 0 ? aVisibleFieldsData : [],
                    "MANDATORY": aMandatoryFieldsData.length > 0 ? aMandatoryFieldsData : [],
                    "UPDATED": aUpdatedFieldsData.length > 0 ? aUpdatedFieldsData : [],
                    "OPENTEXT": await getOpenTextCredentials(connection),
                    "CLIENT_INFO": await getClientDetails(connection),
                    "TOTALCOUNT": totalCount,
                    "SETTINGS": aSettings,
                    "LABELS": await getLabelsForFormID(connection)
                };
                return responseObj;
            }

        } catch (error) { 
            var iErrorCode=error.code??500;   
 
            if(error.errorType !== "Warning")
            lib_common.postErrorLog(Result,requestNo,userId,userRole,"Distributor Registration Form",sType,dbConn,hdbext);  //New  
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    });

    async function getClientDetails(connection) {
        try {
            var aDataObj = "";
            let aResult = await connection.run(
                SELECT`CLIENT_FULL_NAME,CLIENT_SHORT_NAME,CLIENT_COUNTRY`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID']}`
                    .where({ SR_NO: 1 }));
            if (aResult.length > 0) {
                aDataObj = aResult[0];
            }
            return aDataObj;
        }
        catch (error) { throw error; }
    }
    async function getLabelsForFormID(connection) {
        try {
            var aDataObj = "";
            var responseObj = []
            let aResult = await connection.run(
                SELECT`FIELDS,DESCRIPTION`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_REGFORM_FIELDS_ID_DESC']}`
                    .orderBy("FIELDS")
                    );
             const outputObject = aResult.reduce((result, item) => {
                result[item["FIELDS"]] = item["DESCRIPTION"];
                return result;
              }, {});         
             return [outputObject];
        }
        catch (error) { throw error; }}

    this.on('GetSecurityPin', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        try {       
            var { distributorName, distributorEmail, requesterId,userId,userRole } = req.data;
            var isEmailNotificationEnabled = false;

            if (distributorName === null || distributorEmail === null) {
                throw "Invalid Payload";  
            }

            var sDistributorName = distributorName.toUpperCase().trim() || "";
            var sDistributorEmail = distributorEmail.toLowerCase().trim() || "";
            var sBuyerEmail = requesterId || "";

            var sSecurityPin = await getRandomNumber();

            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);

            //intialize connection to database
            let connection = await cds.connect.to('db');

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_common.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            // load procedure
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_SECURITY_PIN')
            sResponse = await dbConn.callProcedurePromisified(loadProc, [sDistributorEmail, sSecurityPin]);


            if (sResponse.outputScalar.OUT_SUCCESS !== null) {

                var oPinEmailData = {
                    "DistributorName": sDistributorName,
                    "DistributorId": sDistributorEmail,
                    "sSecurityPin": sSecurityPin,
                    "sBuyerId": sBuyerEmail
                };

                if (isEmailNotificationEnabled) {
                    var oEmaiContent = await lib_email_content.getEmailContent(connection, null, "SEC_PIN", oPinEmailData, null);
                    // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sSupplierEmail], [sBuyerEmail], null);
                    var sCCEmail = await lib_email.setSampleCC( [sBuyerEmail]);
                    await  lib_email.sendidealEmail(sDistributorEmail,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
              
                }
                req.reply({ "SUCCESS": 'Yes' });
            }
        } catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,userId,userRole,"Distributor Registration Form",sType,dbConn,hdbext);   
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })

    this.on('CheckSecurityPin', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        let dbConn = new dbClass(client);
        try {
            var { distributorEmail,securityPin,userId,userRole} = req.data;
            var response ={};

            if (distributorEmail !== "" && distributorEmail !== null && distributorEmail !== undefined) {
                let connection = await cds.connect.to('db');//form connection to database
               
                let sEmailCheck = await connection.run(SELECT
                    .from(`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`)
                    .where({ REGISTERED_ID: distributorEmail }));
                if(sEmailCheck.length > 0)
                {   
                    let sResult = await connection.run(SELECT
                        .from(`${connection.entities['DEALER_PORTAL.REQUEST_SECURITY_CODE']}`)
                        .where({ REGISTERED_ID: distributorEmail }));     
                    if (sResult.length > 0) {
						if(securityPin === null)
							return;
                         //Check if user entered pin matched with generated pin
                         if(sResult[0].SEC_CODE === securityPin)
                         {
                            response["CREATED_ON"]= new Date(sResult[0].CREATED_ON);
                            response["IS_MATCH"] = true;
                            response["RESPONSE_MESSAGE"]= "Valid Security Pin";
                            req.reply(response);
                         }
                         else{
                            response["CREATED_ON"]= new Date(sResult[0].CREATED_ON);
                            response["IS_MATCH"] = false;
                            response["RESPONSE_MESSAGE"]= "Invalid Security Pin entered";
                            req.reply(response);
                         } 
                    }
                    else{
                        throw {"message": "Generate Security Pin against email id",
                               "errorType":"Warning"};}}
                else{
                    throw  {"message":"Please enter Registered Email Id",
                    "errorType":"Warning"};
                }
            } else throw {"message": "Distributor email id is missing for security pin check.",
                            "errorType":"Warning"}

        } catch (error) {
           
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            // if(error.errorType !== "Warning")  
            lib_common.postErrorLog(Result,null,userId,userRole,"Distributor Registration Form",sType,dbConn,hdbext);   
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    });

    this.on('MessengerService', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        let dbConn = new dbClass(client);
        try {
            var { action, messengerData, appType, inputData, eventsData,userDetails } = req.data;
            var isEmailNotificationEnabled = false;
            var sUserIdentity=userDetails.USER_ID || null;
            var sUserRole=userDetails.USER_ROLE || null;

            //intialize connection to database
            let connection = await cds.connect.to('db');

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            var iReqNo = inputData[0].REQUEST_NO || null;
            var sEntityCode = inputData[0].ENTITY_CODE || null;
            var sSupplierEmail = inputData[0].REGISTERED_ID || null;
            var sBuyerEmail = inputData[0].REQUESTER_ID || null;
            var sDistributorName = inputData[0].DEALER_NAME1 || null;
            var sLoginId = messengerData.loginId;
            var sMailTo = messengerData.mailTo;
            var sType = appType;
            // var sRoleCOde = roleCode;
            var sLevel = inputData[0].APPROVER_LEVEL || 1;

            // var sAction = inputData[0].ACTION;
            var aEventObj = await getEventObj(eventsData, action);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'MESSENGER_SERVICE')
            Result = await dbConn.callProcedurePromisified(loadProc,
                [iReqNo, sSupplierEmail, sMailTo, action, aEventObj]);

            if (Result.outputScalar.OUT_SUCCESS === null)
                throw "Messenger failed to send message!";

            var responseObj = {
                "Message": Result.outputScalar.OUT_SUCCESS
            };

            if (Result.outputScalar.OUT_SUCCESS !== null) {

                var oEmailData = {
                    "ReqNo": iReqNo,
                    "SupplierName": sDistributorName,
                    "From_Email": sLoginId,
                    "To_Email": Result.outputScalar.OUT_EMAIL_TO,
                    "sMessage": aEventObj[0].COMMENT
                };
                var sAppName; 
                var sPmId = "";
                if (action === "DISTRIBUTOR") {
                    var dataApprover = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'CALC_HIERARCHY_MATRIX',sType,sLevel) || "";
                    var sRoleCode = dataApprover[0].ROLE_CODE || null;
                    sLevel = dataApprover[0].LEVEL || 1;
                    sPmId = await lib_common.getApproverForEntity(connection, sEntityCode, sRoleCode, 'CALC_HIERARCHY_MATRIX',sType,sLevel) || "";
                    // sPmId = await lib_common.getApproverForEntity(connection, sEntityCode, 'PM', 'MATRIX_REGISTRATION_APPR') || "";
                    if (sPmId !== "") sPmId = sPmId[0].USER_IDS;
                    sAppName="Distributor Registration Form"
                }else{
                    sAppName=await getAppName(iReqNo);
                } 
                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, action, "COMMUNCATION", oEmailData, null)
                    var sCCEmail = await lib_email.setSampleCC( [sPmId]);
                    await  lib_email.sendidealEmail(oEmailData.To_Email,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
                statusCode = 200;
            } else {
                statusCode = 400;
            }
            // responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);
            req.reply(responseObj);
        } catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            // lib_common.postErrorLog(Result,iReqNo,sUserIdentity,sUserRole,"Vendor Registration",sType,dbConn,hdbext);   
            lib_common.postErrorLog(Result,iReqNo,sUserIdentity,sUserRole,sAppName,sType,dbConn,hdbext);  
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })

    this.on('EditRegFormData', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        try {
            var { action, stepNo, reqHeader, addressData, contactsData, updatedFields, editLog,userDetails} = req.data;   
            var isEmailNotificationEnabled = false;
            // get connection
            // var client = await dbClass.createConnectionFromEnv();
            // let dbConn = new dbClass(client);
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::ONBOARDING_REJECT');

            //intialize connection to database
            let connection = await cds.connect.to('db');
            //  queryResult = await connection.run(SELECT `COUNT(*)`
            //  .from`${connection.entities['VENDOR_PORTAL.REQUEST_INFO_TEMP']}`
            //  .where`REQUEST_NO = ${reqHeader[0].REQUEST_NO}`);

            //Check if email notification is enabled
            // isEmailNotificationEnabled = await lib_email.isiVenSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            var sUserIdentity=userDetails.USER_ID || null;
            var sUserRole=userDetails.USER_ROLE || null;

            var iReqNo = reqHeader[0].REQUEST_NO || null;
            var sUserId = reqHeader[0].REGISTERED_ID || null;
            var sEntityCode = reqHeader[0].ENTITY_CODE || null;
            var sIsResend = reqHeader[0].REQUEST_RESENT || null;
            var iStatus = reqHeader[0].STATUS || null;
            var aAddressObj = await getidForArr(addressData, "SR_NO") || [];
            var aContactObj = await getidForArr(contactsData, "SR_NO") || [];

            // --Section 2--
            // var aFinanceObj = getidForArr(oPayload.VALUE.FINANCE, "SR_NO") || [];

            // var aCustomerObj = getidForArr(oPayload.VALUE.CUSTOMER, "SR_NO") || [];

            // --Section 5--
            // var aAttachFieldsObj = oPayload.VALUE.ATTACH_FIELDS || [];
            // if (aAttachFieldsObj.length > 0) {
            //     aAttachFieldsObj[0].OBR_NO = 0;
            // }
            // var aAttachmentsObj = getidForArr(oPayload.VALUE.ATTACHMENTS, "SR_NO") || [];

            var aUpdatedFieldsIDs = updatedFields;
            var aUpdatedFieldsObj = [];
            if (aUpdatedFieldsIDs.length > 0) {
                aUpdatedFieldsObj = await lib_common.getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) || [];
            }

            var aLogsTable = await getLogsCount(connection, editLog);
            // Result = execProcedure(iReqNo, iStep, sEntityCode, sUserId, sIsResend, iStatus,
            //     aMainObj, aAddressObj, aContactObj,
            //     aPaymentObj, aFinanceObj, aOwnerObj,
            //     aProdServbj, aCapacityObj, aCustomerObj, aOEMObj,
            //     aDiscFieldsObj, aRelativeObj, aQaCertiObj,
            //     aAttachFieldsObj, aAttachmentsObj,
            //     aUpdatedFieldsObj,aLogsTable);
            if (action === 'APPROVE') {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_EDIT_APPROVER')
                Result = await dbConn.callProcedurePromisified(loadProc,
                    [iReqNo,stepNo, sUserId,null, reqHeader, aAddressObj, aContactObj, [], [], [], [],
                        [], [], [], aUpdatedFieldsObj, aLogsTable]);

                if (Result.outputScalar.OUT_SUCCESS === null) {

                    let sErrorMsg = JSON.stringify({
                        "Edit_Success": '',
                        "REQUEST_NO": 0,
                        "Message": "Edit saving failed!"

                    })
                    throw sErrorMsg;
                }
                responseObj = {
                    "Edit_Success": 'X',
                    "REQUEST_NO": Result.outputScalar.OUT_SUCCESS,
                    "Message": "Edit saved successfully"
                };

                // responseInfo(JSON.stringify(responseObj), "text/plain", 200);
                req.reply(responseObj);
            }
        } catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;   
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,iReqNo,sUserIdentity,sUserRole,"Distributor Registration Approval",sType,dbConn,hdbext);   
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })

    async function getObjectFromRows(aDataObjects) {
        try {
            var oReturnObj = {},
                datalength = aDataObjects.length;
            if (datalength > 0) {
                for (var i = 0; i < datalength; i++) {
                    oReturnObj[aDataObjects[i].CODE.toString()] = aDataObjects[i].SETTING;
                }
            } return oReturnObj;
        }
        catch (error) { throw error; }
    }

    async function getLogsCount(conn, oPayloadValue) {
        try {
            var iCount = 0;
            let aResult = await conn.run(
                SELECT` MAX(EVENT_NO) AS COUNT`
                    .from`${conn.entities['DEALER_PORTAL.SUPPLIER_PROFILE_LOG']}`
                    .where`SAP_DIST_CODE =${oPayloadValue[0].SAP_DIST_CODE}`
            );
            if (aResult.length > 0) {
                iCount = aResult[0].COUNT + 1;
            } else {
                iCount = iCount + 1;
            }
            for (var i = 0; i < oPayloadValue.length; i++) {
                var no = iCount + i;
                oPayloadValue[i].EVENT_NO = no;
            }
            return oPayloadValue;
        }
        catch (error) {
            throw error;
        }
    }

    async function getCcodeRType(connection, requestNo, sTable) {
        try {
            var oDataObjects = null, aEntityResult = null;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo })
            );
            if (aResult.length > 0) {
                aEntityResult = await connection.run(
                    SELECT`BUTXT`
                        .from`${connection.entities['DEALER_PORTAL.MASTER_ENTITY_CODE']}`
                        .where({ BUKRS: aResult[0].ENTITY_CODE })
                );
                if (aEntityResult.length > 0) {
                    oDataObjects = {
                        "EntityCode": aResult[0].ENTITY_CODE,
                        "CreationType":aResult[0].CREATION_TYPE,
                        "RequestTypeDesc": aEntityResult[0].BUTXT
                    };
                }}
            return oDataObjects;
        }
        catch (error) { throw error; }
    }
    async function getDraftData(connection, requestNo) {
        try {
            var aMainData = await checkOtFolderIds(connection, await getTableData(connection, requestNo, "REQUEST_INFO")) || [];

            var oDraftObj = {
                "MAIN": aMainData || [],
                "ADDRESS": await getAddressWithDesc(connection, await getTableData(connection, requestNo, "REGFORM_ADDRESS") || []),
                "CONTACTS": await getContactsWithDesc(connection, await getTableData(connection, requestNo, "REGFORM_CONTACTS") || []),

                "FINANCE": await getTableData(connection, requestNo, "REGFORM_BANKS") || [],

                "BUSINESS_HISTORY": await getTableData(connection, requestNo, "REGFORM_BUSINESS_HISTORY") || [],
                "CUSTOMER": await getTableData(connection, requestNo, "REGFORM_CUSTOMERS") || [],
                "PROMOTERS": await getTableData(connection, requestNo, "REGFORM_PROMOTERS") || [],

                "ATTACHMENTS": await getAttachmentsData(connection, requestNo, "REGFORM_ATTACHMENTS", "ONB") || [],
                "EVENTS": await getEventsData(connection, requestNo, "REQUEST_EVENTS_LOG", "MSG") || []
            };
            return oDraftObj;
        }
        catch (error) { throw error; }
    }
    async function getTableData(connection, requestNo, sTable) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo })
            );
            return aResult;
        }
        catch (error) { throw error;}
    }
    async function getAttachmentsData(connection, requestNo, sTable, sAttachType) {
        try {
            let aResult = await connection.run(
                SELECT`REQUEST_NO,SR_NO,ATTACH_CODE,ATTACH_GROUP,ATTACH_DESC,ATTACH_VALUE,EXPIRY_DATE,FILE_NAME,FILE_TYPE,FILE_MIMETYPE,OT_DOC_ID`
                    .from`${connection.entities['DEALER_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo, FILE_TYPE: sAttachType }));

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getOpenTextCredentials(connection) {
        try {
            var aDataObj = "";
            let aResult = await connection.run(
                SELECT`USERNAME,PASSWORD,ADD_INFO1`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_CREDENTIAL']}`
                    .where({ TYPE: 'OPENTEXT', SR_NO: 1 }));
            if (aResult.length > 0) {
                aDataObj = aResult[0];
            }
            return aDataObj;
        }
        catch (error) { throw error; }
    }
    async function getRandomNumber() {

        var randomNo = JSON.stringify(Math.floor(100000 + Math.random() * 900000));
        return randomNo;

    }
    async function getUpdatedFieldsData(connection, requestNo) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED']}`
                    .where({ REQ_NO: requestNo }));
            return aResult;
        }
        catch (error) { throw error; }
    }
    async function getAppName(iReqNo){
        var aReqInfo=await SELECT .from('DEALER_PORTAL_REQUEST_INFO') .where({REQUEST_NO:iReqNo});   
        return aReqInfo[0].STATUS==1?"Distributor Request Approval":"Distributor Registration Approval";
    }   
    async function getEventObj(oPayloadValue, action) {

        var iEventCode = null,
            sRemark = null;

        switch (action) {
            case "DISTRIBUTOR":
                iEventCode = 10;
                sRemark = "Distributor sent message to Sales Associate";
                break;
            case "SALESASSOCIATE":
                iEventCode = 11;
                sRemark = "Sales Associate sent message to Distributor";
                break;
            case "APPROVER":
                iEventCode = 13;
                sRemark = "Approver sent message to Distributor";
                break;
        }

        var eventArr = [];

        if (oPayloadValue.length === 1) {
            eventArr = [{
                "REQUEST_NO": 0,
                "EVENT_NO": 0,
                "EVENT_CODE": iEventCode,
                "USER_ID": oPayloadValue[0].USER_ID,
                "USER_NAME": oPayloadValue[0].USER_NAME,
                "REMARK": sRemark,
                "COMMENT": oPayloadValue[0].COMMENT,
                "CREATED_ON": oPayloadValue[0].CREATED_ON,
                "EVENT_TYPE": oPayloadValue[0].EVENT_TYPE
            }];

        } else {
            throw "Incorrect Data format for posting";
        }

        return eventArr;
    }

    async function getiDealSettings(connection) {
        try {
            let aResult = await connection.run(
                SELECT`CODE,SETTING`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_SETTINGS']}`
                    .where({ TYPE: 'REGFORM' }));
            return aResult;
        }
        catch (error) { throw error; }
    }
    async function getEventsData(connection, requestNo, sTable, sMsgType) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo, EVENT_TYPE: sMsgType }));
            return aResult;
        }
        catch (error) { throw error; }
    }
    async function getMandatoryVisibleFieldsData(connection, entityCode, creationType,type) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG']}`
                    .where({ CCODE: entityCode, REQ_TYPE: creationType, TYPE: type }));
            return aResult;
        }
        catch (error) { throw error; }
    }

    async function checkOtFolderIds(connection, aMainData) {
        try {
            var aFolderIdData = null;
            var aMainDataLocal = [];
            if (aMainData.length === 1 && (aMainData[0].OT_PARENT_ID === null || aMainData[0].OT_FOLDER1_ID === null || aMainData[0].OT_FOLDER2_ID === null)) {
                aFolderIdData = await getOtFolderIdData(connection, "REGFORM_FOLDER_IDS", aMainData[0].IDEAL_DIST_CODE);

                if (aFolderIdData.length > 0) {
                    aMainDataLocal = JSON.parse(JSON.stringify(aMainData));

                    aMainDataLocal[0].OT_PARENT_ID = aFolderIdData[0].OT_PARENT_ID;
                    aMainDataLocal  [0].OT_FOLDER1_ID = aFolderIdData[0].OT_FOLDER1_ID;
                    aMainDataLocal[0].OT_FOLDER2_ID = aFolderIdData[0].OT_FOLDER2_ID;

                    aMainData = aMainDataLocal;
                }
            }
            return aMainData;
        }
        catch (error) { throw error; }
    }
    async function getOtFolderIdData(connection, sTable, sIdealDistCode) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.' + sTable]}`
                    .where({ IDEAL_DIST_CODE: sIdealDistCode }));
         
            return aResult;
        }
        catch (error) { throw error; }
    }
    async function getAddressWithDesc(connection, addressArr) {
        try {
            var addressWithDesc = [];
            if (addressArr.length > 0) {
                var dataObj = {};
                for (var i = 0; i < addressArr.length; i++) {
                    dataObj = JSON.parse(JSON.stringify(addressArr[i]));
                    if (dataObj.COUNTRY !== "" || dataObj.COUNTRY !== null) {
                        dataObj.COUNTRY_DESC = await getCountryDesc(connection, dataObj.COUNTRY) || "";
                    }
                    if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                        dataObj.REGION_DESC = await getRegionDesc(connection, dataObj.COUNTRY, dataObj.STATE) || "";
                    }
                    addressWithDesc.push(dataObj);
                }
            }

            return addressWithDesc;
        }
        catch (error) { throw error; }
    }
    async function getContactsWithDesc(connection, contactsArr) {
        try {
            var addressWithDesc = [];
            if (contactsArr.length > 0) {
                var dataObj = {};
                for (var i = 0; i < contactsArr.length; i++) {
                    dataObj = JSON.parse(JSON.stringify(contactsArr[i]));
                    if (dataObj.NATIONALITY !== "" || dataObj.NATIONALITY !== null) {
                        dataObj.COUNTRY_DESC = await getCountryDesc(connection, dataObj.NATIONALITY) || "";
                    }
                    if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                        dataObj.REGION_DESC = await getRegionDesc(connection, dataObj.NATIONALITY, dataObj.STATE) || "";
                    }
                    addressWithDesc.push(dataObj);
                }
            return addressWithDesc;
        }
    }
        catch (error) { throw error; }
    }
    async function getCountryDesc(connection, countryCode) {
        try {
            var sDesc = "";
            let aResult = await connection.run(
                SELECT`LANDX`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_COUNTRY']}`
                    .where({ LAND1: countryCode }));

            if (aResult.length > 0) {
                sDesc = aResult[0].LANDX;
            }
            return sDesc;
        }
        catch (error) { throw error; }
    }

    async function getRegionDesc(connection, countryCode, regionCode) {
        try {
            var sDesc = "";
            let aResult = await connection.run(
                SELECT`BEZEI`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_REGION']}`
                    .where({ LAND1: countryCode, BLAND: regionCode }));

            if (aResult.length > 0) {
                sDesc = aResult[0].BEZEI;
            }
            return sDesc;
        }
        catch (error) { throw error; }
    }

})
