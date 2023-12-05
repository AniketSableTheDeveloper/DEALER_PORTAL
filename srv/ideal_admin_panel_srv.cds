using {DEALER_PORTAL} from '../db/MASTER_TABLES';
using {DEALER_PORTAL.IDEAL_ERROR_LOG,
DEALER_PORTAL.REGFORM_FOLDER_IDS
} from '../db/TRANSACTION_TABLES';

service ideal_admin_panel_srv {

    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterTableNames as projection on DEALER_PORTAL.MASTER_TABLENAMES;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterAttachmentTypes as projection on DEALER_PORTAL.MASTER_ATTACHMENT_TYPES;
    entity MasterIdealSettings as projection on DEALER_PORTAL.MASTER_IDEAL_SETTINGS;
    entity MasterIdealAttachments as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity IdealErrorLog as projection on DEALER_PORTAL.IDEAL_ERROR_LOG;
    entity RegformFolderIds as projection on DEALER_PORTAL.REGFORM_FOLDER_IDS;
    entity EmailConfig as projection on DEALER_PORTAL.EMAIL_CONFIG;

    //TEST
  // entity region as projection on VENDOR_PORTAL.MASTER_REGION;
  // entity address as projection on VENDOR_PORTAL.REGFORM_ADDRESS;

  //Get data for Admin Panel
  // function GetAdminPanelData(action : String, tableCode : MasterTableNames:TABLE_CODE, requestNo : Integer) returns array of String;
  function GetAdminPanelData(action : String, tableCode : String, requestNo : Integer) returns array of String;
  //Get Visible and Mandatory Fields
  function GetVisbleMandatoryFields(requestType : Integer, entityCode : String)returns array of String;
  //Post Data for Admin Panel
  action   PostAdminPanelData(input : String)returns array of String;
  //Post Admin Panel Edits
  action   EditAdminPanelData(input : String)returns array of String;
  function TestOnPremiseConnection(sapClient : String, destFileName : String)returns array of String;

//Dynamic Logic
//  action   DynamicPostAdminPanelData(input : String)                                          returns array of String;
//   action   DynamicEditAdminPanelData(input : String)                                          returns array of String;

}