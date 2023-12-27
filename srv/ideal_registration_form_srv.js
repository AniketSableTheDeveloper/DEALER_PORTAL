const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email') 

module.exports = cds.service.impl(function () {

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
            var registeredUser =await  lib_common.getRegisteredId(requestNo,connection);

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

                var responseObj = {
                    "DRAFT": (aDraftData.MAIN.length || aDraftData.ADDRESS.length) > 0 ? aDraftData : [], // changes to save country from registration form 10/04/2023
                    // "DRAFT": aDraftData.MAIN.length > 0 ? aDraftData : [],
                };
                return responseObj;
            }

        } catch (error) { 
            var iErrorCode=error.code??500;   
 
            if(error.errorType !== "Warning")
            // lib_common.postErrorLog(Result,requestNo,userId,userRole,"Vendor Registration Form",sType,dbConn,hdbext);  //New  
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    });
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

                "FINANCE": await getTableData(connection, requestNo, "REGFORM_FINANCIAL") || [],

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
