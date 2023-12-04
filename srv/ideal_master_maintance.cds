using {DEALER_PORTAL} from '../db/MASTER_TABLES';

service ideal_master_maintance {

    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterTableNames as projection on DEALER_PORTAL.MASTER_TABLENAMES;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterTelecode as projection on DEALER_PORTAL.MASTER_TELECODE;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterAttachmentTypes as projection on DEALER_PORTAL.MASTER_ATTACHMENT_TYPES;
    entity MasterIasUser as projection on DEALER_PORTAL.MASTER_IAS_USER;
    entity MasterIbanCountry as projection on DEALER_PORTAL.MASTER_IBAN_COUNTRY;
    entity MasterIdealSettings as projection on DEALER_PORTAL.MASTER_IDEAL_SETTINGS;
    entity MasterRegexPostalCode as projection on DEALER_PORTAL.MASTER_REGEX_POSTALCODE;
    entity MasterIdealAttachments as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterRequestEvents as projection on DEALER_PORTAL.MASTER_REQUEST_EVENTS;
    entity MasterRegformFieldsIdDesc as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_ID_DESC;
    entity MatrixRequestAppr as projection on DEALER_PORTAL.MATRIX_REQUEST_APPR;
    entity MatrixRegistrationAppr as projection on DEALER_PORTAL.MATRIX_REGISTRATION_APPR;
    entity MasterIdeaUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity MasterCredential as projection on DEALER_PORTAL.MASTER_CREDENTIAL;
    entity MasterEmailContactId as projection on DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID;
    entity MasterIdealSapVendorNo as projection on DEALER_PORTAL.MASTER_IDEAL_SAP_VENDOR_NO;
    entity MasterSapClient as projection on DEALER_PORTAL.MASTER_SAP_CLIENT;
    entity MasterSubaccount as projection on DEALER_PORTAL.MASTER_SUBACCOUNT;

    action UserMasterCrud(input : many MasterIdeaUsers,Action : String(100))returns String;
    

}