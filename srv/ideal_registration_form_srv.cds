using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_COUNTRY,DEALER_PORTAL.MASTER_REGION,
DEALER_PORTAL.MASTER_CURRENCY,DEALER_PORTAL.MASTER_ENTITY_CODE,DEALER_PORTAL.MASTER_STATUS,
DEALER_PORTAL.MASTER_REQUEST_TYPE} from '../db/MASTER_TABLES';

service ideal_registration_form_srv {

    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformFinancial as projection on DEALER_PORTAL.REGFORM_FINANCIAL;
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

    function GetDraftData(requestNo : Integer, entityCode : String, creationType : Integer, userId : String, userRole : String)  returns many String;

    action PostRegFormData(action : String, stepNo : Integer, reqHeader : many RequestInfo, addressData : many RegformAddress, promotersData : many RegformPromoters,businessHistoryData : many RegformBusinessHistory,contactsData : many RegformContacts, financeData : many RegformFinancial, customerData : many RegformCustomers,attachmentData : many RegformAttachments, updatedFields : many String, eventsData : many RegEventsLog, userDetails : User_Details) returns many String;
    // bankData : many RegformBanks,ownersData : many RegformOwners,  prodServData : many RegFormProdServ, capacityData : many RegFormCapacity,
    // oemData : many RegFormOEM,discFieldsData : many RegFormDiscInfo,discRelativesData : many RegFormDiscRelatives, discQaCertiData : many RegFormDiscQaCertif,
    // attachmentFieldsData : many RegFormAttachFields,
}