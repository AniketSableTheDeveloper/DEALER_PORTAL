const cds = require("@sap/cds");
const lib_email = require("./ideal_library_email.js");
const SequenceHelper = require("./SequenceHelper");
const lib_admin = require('./ideal_library_admin_panel');

module.exports = {
	getMDGPayload:async function(oHanaPayload,addressData,contactsData,bankData, conn) {
		try{
        var iDealDistCode = oHanaPayload[0].IDEAL_DIST_CODE ? oHanaPayload[0].IDEAL_DIST_CODE.toString() : "";
        var sSAPDistCode = oHanaPayload[0].SAP_DIST_CODE || "";
        var iRequestType = oHanaPayload[0].REQUEST_TYPE;
        // var iSupplierType = oHanaPayload[0].SUPPL_TYPE;
        var sBP_Type = oHanaPayload[0].BP_TYPE_CODE || "";
        var aHQAddress =await this.getHQAddressArray(addressData);
		aHQAddress = aHQAddress.length > 0 ? aHQAddress :[{}];
        var aGeneralDataSet = null;
        var Scenario = "";
        var sTradingPartner = "";
        var sExemptionReason = await this.getAtachmentDataSet(iDealDistCode, oHanaPayload[0], conn) || "";
    
        if (oHanaPayload.length) {
    
            if (iRequestType === 1 || iRequestType === 2 || iRequestType === 3 || iRequestType === 6 || iRequestType === 7) {
                Scenario = "C";
    
                // Generate SAP Vendor code sequence by Supplier Type
                // if (iSupplierType === "ZVND") {
                //     // Commercial Vendor
                //     if (sSAPDistCode === null || sSAPDistCode === "" || sSAPDistCode === undefined) {
                //         //   sSAPDistCode = getNewSapVendorCode(conn);
                //         sSAPDistCode = "";
                //     }
                // } else if (iSupplierType === "ZICB") {
                //     // Intercompany Vendor
                //     sTradingPartner = "0000000000" + sSAPDistCode;
                //     sTradingPartner = sTradingPartner.slice(-10);
    
                //     sSAPDistCode =await this.getNewSapVendorCode(conn);
                // }
            } else if (iRequestType === 4) {
                Scenario = "E";
            } else if (iRequestType === 5 && sSAPDistCode !== "") {
                Scenario = "U";
                sSAPDistCode = ("0000000000" + sSAPDistCode).slice(-10);
            } else if (iRequestType === 5 && sSAPDistCode === "") {
                throw "SAP Distributor Code missing for Update request";
            } else if (sBP_Type === "") {
                throw "Supplier Sub Type is missing";
            }
    
            aGeneralDataSet =await this.getGeneralDataSet(iDealDistCode, sSAPDistCode, oHanaPayload[0], aHQAddress[0], sBP_Type, sExemptionReason);
            aGeneralDataSet.Scenario = Scenario;
            aGeneralDataSet.BankDetailsSet =await this.getBankDetailsSet(sSAPDistCode, bankData) || [];
            aGeneralDataSet.ContactPersonSet =await this.getContactPersonSet(sSAPDistCode, iRequestType,contactsData, aHQAddress[0]) || [];
    
            if (iRequestType === 7) {
                aGeneralDataSet.CompanyDataSet = []; // For Quick registration no Entity code details needed
            } else {
                aGeneralDataSet.CompanyDataSet =await this.getCompanyDataSet(sSAPDistCode, oHanaPayload[0]) || [];
            }
        }
        return aGeneralDataSet;
	}catch(error){
		throw error;
	}
    },
	// get MDG Genreal section Head office address from array of all Addresses
	getHQAddressArray : async function (aAddressDataArr) {
		try{
		var aDataObjects =[];
			Object.keys(aAddressDataArr).map(function(key) {
			if (aAddressDataArr[key].ADDRESS_TYPE === "HQ") {
				aDataObjects.push(aAddressDataArr[key]);
			}
		});
		return aDataObjects;
	}catch(error){
		throw error;
	}
	},

	// Get MDG Payload structure for Contacts Data
	getCompanyDataSet:async function(sSAPDistCode, aGeneralDataArr) {
		try{
		var aDataObjects = [];
		var oDataObj = {
			"Kunnr": sSAPDistCode || "",
			"Bukrs": aGeneralDataArr.ENTITY_CODE || ""
		};
		aDataObjects.push(oDataObj);
		return aDataObjects;
	}catch(error){
		throw error;
	}
	},

	// Get MDG Payload structure for Contacts Data
	getContactPersonSet:async function(sSAPDistCode, iRequestType, aContactsDataArr, aAddressDataArr) {
		try{
		var aDataObjects = [],
			oDataObj = null,
			sBRRegionCode = "",
			sBRPostalCode = "",
			sRegionCode = null,
			sPostalCode = null,
			sContactBpId = null,
			sNewSapCode = null;
	
		if (aContactsDataArr.length > 0) {
			aDataObjects = Object.keys(aContactsDataArr).map(function(key) {
				
			if(iRequestType === 5) {
				// Pass Contact BP ID in case of update request
				sContactBpId = aContactsDataArr[key].BP_ID || "";
				sNewSapCode = "0000000000" + sContactBpId;
				sNewSapCode = sNewSapCode.slice(-10);
				sSAPDistCode = (sContactBpId === "" || sContactBpId === null) ? "" : sNewSapCode;
			}
			oDataObj = {
				"PartnerID": "",
				"Name1": aContactsDataArr[key].NAME1 || "",
				"Name2": aContactsDataArr[key].NAME2 || "",
				"Designation": aContactsDataArr[key].DESIGNATION || "",
				"HouseNum1": aContactsDataArr[key].HOUSE_NUM1 || "",
				"Street": aContactsDataArr[key].STREET1 || "",
				"City1": "",
				"Country": aContactsDataArr[key].NATIONALITY || "",
				"State": aContactsDataArr[key].STATE || "", // 12-10-2022 - Changed to accomodate separate region code & postal code from contacts section 
				"PoBox": "",
				"PostalCode": aContactsDataArr[key].POSTAL_CODE || "", // 12-10-2022 - Changed to accomodate separate region code & postal code from contacts section
				"TelephoneNumber": aContactsDataArr[key].CONTACT_NO || "",
				"Mobile": aContactsDataArr[key].MOBILE_NO || "",
				"EmailID": aContactsDataArr[key].EMAIL || "",
				"Kunnr": sSAPDistCode || ""
			};
			return oDataObj;
			});}
		return aDataObjects;
	}catch(error){
		throw error;
	}
	},
	// Get MDG Payload structure for Bank Data
	getBankDetailsSet:async function(sSAPDistCode, aBankDataArr) {
		try{
		var aDataObjects = [],
			oDataObj = null,
			sBankAccNo = null;
	
		if (aBankDataArr.length > 0) {
			aDataObjects = Object.keys(aBankDataArr).map(function(key) {
				sBankAccNo = aBankDataArr[key].ACCOUNT_NO || "";
				oDataObj = {
					"Kunnr": sSAPDistCode || "",
					"BankID": aBankDataArr[key].BANK_ID || "",
					"Banks": aBankDataArr[key].BANK_COUNTRY || "",
					"IBAN": aBankDataArr[key].IBAN_NUMBER || "",
					"Bankl": aBankDataArr[key].BANK_KEY || "",
					"Bankn": sBankAccNo.substring(0, 18) || "",
					"Bkont": "",
					"Xezer": "",
					"Bkref": sBankAccNo.substring(18, sBankAccNo.length <= 38 ? sBankAccNo.length : 38) || "",
					"Koinh": aBankDataArr[key].ACCOUNT_HOLDER || "",
					"EbppAccname": aBankDataArr[key].ACCOUNT_NAME || ""
				};
				return oDataObj;
			});}
		return aDataObjects;
	}catch(error){
		throw error;
	}
	},
// Get MDG Payload structure for General Data
getGeneralDataSet:async function(iDealDistCode, sSAPDistCode, aGeneralDataArr, aAddressDataArr, sBP_Type, sExemptionReason) {
	try{
		var sName1 = aGeneralDataArr.DIST_NAME1 || "";
		
		var oPayload = {
			// "Kunnr": sSAPDistCode,
			// "Land1": aAddressDataArr.COUNTRY || "",
			// "Name1":  sName1.substring(0, 40)  ||  "",
			// "Name2": sName1.substring(40, sName1.length <= 80 ? sName1.length : 80) || "",
			// "Ort01": aAddressDataArr.CITY || "",
			// "Ort02": aAddressDataArr.DISTRICT || "",
			// "Pfach": "", // PO Box
			// "Pstlz": aAddressDataArr.POSTAL_CODE || "", // Pin Code
			// "Regio": aAddressDataArr.STATE || "",
			// "Sortl": await this.getSearchTerm(aGeneralDataArr.DIST_NAME1 || "") || "",
			// "Stras": aAddressDataArr.STREET1 || "",
			// "STR_SUPPL1": aAddressDataArr.STREET2 || "",
			// "STR_SUPPL2": aAddressDataArr.STREET3 || "",
			// "STR_SUPPL3": aAddressDataArr.STREET4 || "",
			// "Anred": "Company", //Title
			// "HouseNum": aAddressDataArr.HOUSE_NUM1 || "",
			// "Telephone1": aAddressDataArr.CONTACT_NO || "",
			// "Telephone2": "",
			// "Mobile1": "",
			// "Mobile2": "",
			// "Fax1": aAddressDataArr.FAX_NO || "",
			// "Fax2": "",
			// "Email1": aAddressDataArr.EMAIL || "",
			// "Email2": "",
			// "Sperr": "",
			// "Sperm": "",
			// "Partner": "1234567890",
			// "Type": "CRM001",
			// "Idnumber": iDealDistCode,
			// "BP_Type": sBP_Type, //classification
			// "VAT_RegNo": aGeneralDataArr.VAT_REG_NUMBER || "",
			// "BankDetailsSet": [],
			// "ContactPersonSet": []

			"REPRF":"",
			"ZTERM":"",
			"ZUAWA":"",
			"AKONT":"",
			"Land1":aAddressDataArr.COUNTRY || "",
			"Name1":sName1.substring(0, 40)  ||  "",
			"Name2":sName1.substring(40, sName1.length <= 80 ? sName1.length : 80) || "",
			"Ort01": aAddressDataArr.CITY || "",
			"Ort02": aAddressDataArr.DISTRICT || "",
			"Pfach":"",
			"Pstlz":aAddressDataArr.POSTAL_CODE || "", 
			"Regio": aAddressDataArr.STATE || "",
			"Sortl":await this.getSearchTerm(aGeneralDataArr.DIST_NAME1 || "") || "",
			"Stras":aAddressDataArr.STREET1 || "",
			"STR_SUPPL1":aAddressDataArr.STREET2 || "",
			"STR_SUPPL2":aAddressDataArr.STREET3 || "",
			"STR_SUPPL3":aAddressDataArr.STREET4 || "",
			"Anred":"Company",
			"HouseNum": aAddressDataArr.HOUSE_NUM1 || "",
			"Telephone1": aAddressDataArr.CONTACT_NO || "",
			"Telephone2":"",
			"Mobile1":"",
			"Mobile2":"",
			"Fax1": aAddressDataArr.FAX_NO || "",
			"Email1": aAddressDataArr.EMAIL || "",
			"Email2":"",
			"Sperr":"",
			"Sperm":"",
			"Partner": "1234567890",
			"Type":"CRM001",
			"Idnumber": iDealDistCode,
			"Scenario":"",
			"BP_Type": sBP_Type,
			"VAT_RegNo": aGeneralDataArr.VAT_REG_NUMBER || "",
			"ChangeRequest":"",
			"Kunnr": sSAPDistCode
		};
		return oPayload;
	}catch(error){
		throw error;
	}
	},
	getAtachmentDataSet : async function(iDealDistCode, aGeneralDataArr, conn) {
		try{
			var sExpReason = "";
			var sAttachCode = 1; //27 
			var iReqNo = Number(aGeneralDataArr.REQUEST_NO);
			var sVatIndicator = aGeneralDataArr.VAT_CHECK;
		
			if (sVatIndicator === "N") {	
				let aResult = await conn.run(
					SELECT `ATTACH_VALUE`
						.from`${conn.entities['DEALER_PORTAL.REGFORM_ATTACHMENTS']}`
						.where`REQUEST_NO = ${iReqNo} AND ATTACH_CODE = ${sAttachCode}`
				);
				if (aResult.length > 0) {
					sExpReason = aResult[0].ATTACH_VALUE;
				}
			}
			return sExpReason;
		}catch(error){
			throw error;
		}
	},
	getSearchTerm:async function(sValue) {

		var checkSpace = sValue.match(/^(\S+)\s(.*)/);
		var sSearchTerm = "";
		if (checkSpace !== null) {
			var aSlicedText = sValue.match(/^(\S+)\s(.*)/).slice(1);
			var sFirstText = aSlicedText[0];
			sSearchTerm = sFirstText.substr(0, 10);
		} else {
			sSearchTerm = sValue.substr(0, 10);
		}
	
		return sSearchTerm;
	},
     
// Used to post data to MDG and get Change Request No. as response
PostToMDG:async function(oSapPayload,conn) {
	try{
	var dataobj = oSapPayload;
	var oResponseObj = null;
	var resultData = {
		oResponse: "",
		iStatusCode: 0,
		changerequestNo:null
	};
		if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
			var iDealDistConnection = await cds.connect.to('ZMDG_CUSTOMER_REG_SRV');
			var sResponse = await iDealDistConnection.send({
			  method: 'POST',
			  path: "/GeneralDataSet",
			  data:dataobj,
			  headers: { 'Content-Type': 'application/json',
						  "accept": "application/json",
						  "X-Requested-With": "XMLHttpRequest"}
			})
			oResponseObj = sResponse 
			var iStatus = 200;
			if (oResponseObj && oResponseObj.value) {
				resultData.changerequestNo = oResponseObj.value[0].d.ChangeRequest;
			resultData.oResponse = oResponseObj;
				resultData.iStatusCode = iStatus;
		
			} else {
				resultData.changerequestNo =oResponseObj;
				resultData.oResponse = oResponseObj;
				resultData.iStatusCode = iStatus;
			}
		} else {
			resultData.oResponse = "Invalid Posting Object";
			resultData.iStatusCode = 400;
		}
	return resultData;
}catch(error){throw error;}
 }
    
}
// Get MDG Payload structure for Attachment Data

