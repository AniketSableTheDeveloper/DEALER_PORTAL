using {DEALER_PORTAL,USERMASTER_ENTITIES} from '../db/MASTER_TABLES';
using {DEALER_PORTAL.REQUEST_INFO,
DEALER_PORTAL.REQUEST_EVENTS_LOG,
DEALER_PORTAL.DEALER_MASTER_S4_HANA} from '../db/TRANSACTION_TABLES';

service ideal_request_process_srv {

    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterIdealAttachments as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterRequestEvents as projection on DEALER_PORTAL.MASTER_REQUEST_EVENTS;
    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RequestEventsLog as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
    entity DealerMasterS4Hana as projection on DEALER_PORTAL.DEALER_MASTER_S4_HANA;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity UserMasterEntities as projection on USERMASTER_ENTITIES;

    type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  }

    action RequestProcess(action : String, inputData : many RequestInfo, eventsData : many RequestEventsLog,userDetails:User_Details) returns many String;
    action RequestEditProcess(input : String) returns many String;
    

}