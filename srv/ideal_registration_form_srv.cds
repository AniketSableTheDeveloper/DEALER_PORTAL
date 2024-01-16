using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_COUNTRY,DEALER_PORTAL.MASTER_REGION,
DEALER_PORTAL.MASTER_CURRENCY,DEALER_PORTAL.MASTER_ENTITY_CODE,DEALER_PORTAL.MASTER_STATUS,
DEALER_PORTAL.MASTER_REQUEST_TYPE,DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG,VIEW_REQUEST_ACTIVE_STATUS
} from '../db/MASTER_TABLES';

service ideal_registration_form_srv {

    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformBanks as projection on DEALER_PORTAL.REGFORM_BANKS;
    entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS;
    entity RegformContacts as projection on DEALER_PORTAL.REGFORM_CONTACTS;
    entity RegformCustomers as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
    entity RegformBusinessHistory as projection on DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
    entity RegformPromoters as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
    entity RegformAttachments as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
    entity RegFormCMS as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS;
    entity RegFormAttachFields as projection on DEALER_PORTAL.REGFORM_ATTACH_FIELDS;
    entity RegSupplierLog as projection on DEALER_PORTAL.SUPPLIER_PROFILE_LOG;
    entity RegEventsLog as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterRegformFieldsConfig as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG;
    entity ViewRequestActiveStatus as projection on VIEW_REQUEST_ACTIVE_STATUS;

    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    type securityPinResponse {
    CREATED_ON    : Timestamp;
    IS_MATCH:Boolean;
    RESPONSE_MESSAGE:String(30);
    
  }
  type MessengerData {
      loginId : String;
      mailTo  : String;
    }

    type AttachmentID {
    REQUEST_NO : Integer64;
    SR_NO      : Integer;
    DOC_ID     : Integer64;
  }

    function GetDraftData(requestNo : Integer, entityCode : String, creationType : Integer, userId : String, userRole : String)  returns many String;
    function GetSecurityPin(distributorName : String, distributorEmail : String, requesterId : String, userId : String, userRole : String)returns many String;
    function CheckSecurityPin(distributorEmail : String,securityPin:String, userId : String, userRole : String) returns securityPinResponse;
    action MessengerService(action : String, appType : String, messengerData : MessengerData, inputData : many RequestInfo, eventsData : many RegEventsLog, userDetails : User_Details)returns many String;
    action PostRegFormData(action : String, appType : String,stepNo : Integer, reqHeader : many RequestInfo, addressData : many RegformAddress, promotersData : many RegformPromoters,businessHistoryData : many RegformBusinessHistory,contactsData : many RegformContacts, bankData : many RegformBanks,bankingDetails : many RegformBankingDetails,
    customerData : many RegformCustomers,attachmentData : many RegformAttachments,attachmentFieldsData : many RegFormAttachFields, updatedFields : many String, eventsData : many RegEventsLog, userDetails : User_Details) returns many String;
    action   ManageCMS(action : String, attachmentId : AttachmentID, inputData : many RegFormCMS, userDetails : User_Details) returns many String;
    action   EditRegFormData(action : String, // APPROVER | VENDOR 
    stepNo : Integer,reqHeader : many RequestInfo,addressData : many RegformAddress,contactsData : many RegformContacts,updatedFields : many String,editLog : many RegSupplierLog,userDetails : User_Details) returns many String;

}