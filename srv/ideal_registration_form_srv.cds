using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_COUNTRY,DEALER_PORTAL.MASTER_REGION,
DEALER_PORTAL.MASTER_CURRENCY,DEALER_PORTAL.MASTER_ENTITY_CODE,DEALER_PORTAL.MASTER_STATUS,
DEALER_PORTAL.MASTER_REQUEST_TYPE} from '../db/MASTER_TABLES';

service ideal_registration_form_srv {

    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformBanks as projection on DEALER_PORTAL.REGFORM_BANKS;
    entity RegformContacts as projection on DEALER_PORTAL.REGFORM_CONTACTS;
    entity RegformCustomers as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
    entity RegformBusinessHistory as projection on DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
    entity RegformPromoters as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
    entity RegformAttachments as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
    entity RegEventsLog as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;

    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    type securityPinResponse {
    CREATED_ON    : Timestamp;
    IS_MATCH:Boolean;
    RESPONSE_MESSAGE:String(30);
  }

    function GetDraftData(requestNo : Integer, entityCode : String, creationType : Integer, userId : String, userRole : String)  returns many String;
    function GetSecurityPin(distributorName : String, distributorEmail : String, requesterId : String, userId : String, userRole : String)returns many String;
    function CheckSecurityPin(distributorEmail : String,securityPin:String, userId : String, userRole : String) returns securityPinResponse;

    action PostRegFormData(action : String, stepNo : Integer, reqHeader : many RequestInfo, addressData : many RegformAddress, promotersData : many RegformPromoters,businessHistoryData : many RegformBusinessHistory,contactsData : many RegformContacts, financeData : many RegformBanks, customerData : many RegformCustomers,attachmentData : many RegformAttachments, updatedFields : many String, eventsData : many RegEventsLog, userDetails : User_Details) returns many String;
}