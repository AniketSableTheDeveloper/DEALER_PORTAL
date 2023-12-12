namespace DEALER_PORTAL;
using {DEALER_PORTAL.MASTER_STATUS} from '../db/MASTER_TABLES';
    
entity IDEAL_ERROR_LOG {
 
    key LOG_ID           : String(50);
        REQUEST_NO       : Integer64;
        SR_NO            : Integer64;
        ERROR_CODE       : Integer64;
        ERROR_DESCRPTION : String(1000);
        CREATED_ON       : Timestamp;
        USER_ID          : String(50);
        USER_ROLE        : String(50);
        APP_NAME         : String(50);
        TYPE             : String(50);
               
}

entity REGFORM_FOLDER_IDS {
 
    key IDEAL_DEALER_CODE : Int64;
        SAP_DEALER_CODE  : String(10);
        OT_PARENT_ID     : String(10);
        OT_FOLDER1_ID    : String(25);
        OT_FOLDER2_ID    : String(25);
        OT_FOLDER3_ID    : String(25);
        OT_FOLDER4_ID    : String(25);
}

entity REQUEST_INFO {
    key REQUEST_NO               : Integer64;
        SAP_DEALER_CODE          : String(10);
        IDEAL_DEALER_CODE         : Integer64;
        STATUS                   : Integer;
        REGISTERED_ID            : String(100); // Dealer Email ID
        ENTITY_CODE              : String(10);
        REQUEST_TYPE             : Integer;
        CREATION_TYPE            : Integer;
        DEALER_NAME1             : String(100);
        DEALER_NAME2             : String(100);
        DEALER_CODE              : String(50);
        APPROVER_LEVEL           : Integer;
        APPROVER_ROLE            : String(50);
        NEXT_APPROVER            : String(100);
        REQUESTER_ID             : String(100); // Request creator i.e. Buyer Email ID
        SUPPL_TYPE               : String(50);
        SUPPL_TYPE_DESC          : String(50);
        BP_TYPE_CODE             : String(4);
        BP_TYPE_DESC             : String(100);
        REQUEST_RESENT           : String(5);
        MDG_CR_NO                : String(15);
        LAST_ACTIVE_REQ_NO       : Integer64;
        SECONDARY_EMAILS_ID      : String(500);
        WEBSITE                  : String(100);
        LEGAL_STRUCTURE          : String(50);
        LEGAL_STRUCTURE_OTHER    : String(100);
        ESTAB_YEAR               : String(4);
        NO_OF_EMP                : Integer;
        NO_OF_ENGG               : Integer;
        NO_OF_QUALITY            : Integer;
        NO_OF_PROD               : Integer;
        NO_OF_ADMIN              : Integer;
        NO_OF_OTHERS             : Integer;
        BUSINESS_TYPE            : String(50);
        TRADE_LIC_NO             : String(50);
        TRADE_LIC_NO_DATE        : Date;
        VAT_REG_NUMBER           : String(25);
        VAT_REG_DATE             : Date;
        SUPPL_CATEGORY           : String(5000);
        SUPPL_CATEGORY_DESC      : String(5000);
        ACTIVITY_TYPE            : String(30);
        ORDER_SIZE_MIN           : String(50);
        ORDER_SIZE_MAX           : String(50);
        TOTAL_PROD_CAPACITY      : String(20);
        LAST_SAVED_STEP          : Integer;
        COMPLETED_BY             : String(100);
        COMPLETED_BY_POSITION    : String(50);
        ACK_VALIDATION           : String(5);
        SUBMISSION_DATE          : Timestamp;
        LAST_UPDATED_ON          : Timestamp;
        OT_PARENT_ID             : String(10);
        OT_FOLDER1_ID            : String(25);
        OT_FOLDER2_ID            : String(25);
        OT_FOLDER3_ID            : String(25);
        OT_FOLDER4_ID            : String(25);
        VAT_CHECK                : String(1);
        ICV_SCORE                : Decimal;
        ICV_DATE                 : Date;
        ICV_CHECK                : String(1);
        NDA_TYPE                 : String(50);
        REMINDER_COUNT           : Integer;
        BUYER_ASSIGN_CHECK       : String(1);
        CREATED_ON               : Timestamp;
        COMMENT                  : String(1000);
        LEGACY_ID                : String(10);
        TO_STATUS                : Association to one DEALER_PORTAL.MASTER_STATUS
                                       on TO_STATUS.CODE = STATUS;
        // TO_ADDRESS               : Association to many DEALER_PORTAL.REGFORM_ADDRESS
        //                                on TO_ADDRESS.REQUEST_NO = REQUEST_NO;
        // TO_CONTACTS              : Association to many DEALER_PORTAL.REGFORM_CONTACTS
        //                                on TO_CONTACTS.REQUEST_NO = REQUEST_NO;
        // TO_BANKS                 : Association to many DEALER_PORTAL.REGFORM_BANKS
        //                                on TO_BANKS.REQUEST_NO = REQUEST_NO;
        // TO_FINANCE               : Association to many DEALER_PORTAL.REGFORM_FINANCIAL
        //                                on TO_FINANCE.REQUEST_NO = REQUEST_NO;
        // TO_OWNERS                : Association to many DEALER_PORTAL.REGFORM_OWNERS
        //                                on TO_OWNERS.REQUEST_NO = REQUEST_NO;
        // TO_PRODUCT_SERVICES      : Association to many DEALER_PORTAL.REGFORM_PRODUCT_SERVICE
        //                                on TO_PRODUCT_SERVICES.REQUEST_NO = REQUEST_NO;
        // TO_CAPACITY              : Association to many DEALER_PORTAL.REGFORM_CAPACITY
        //                                on TO_CAPACITY.REQUEST_NO = REQUEST_NO;
        // TO_CUSTOMERS             : Association to many DEALER_PORTAL.REGFORM_CUSTOMERS
        //                                on TO_CUSTOMERS.REQUEST_NO = REQUEST_NO;
        // TO_OEM                   : Association to many DEALER_PORTAL.REGFORM_OEM
        //                                on TO_OEM.REQUEST_NO = REQUEST_NO;
        // TO_MANDATORY_FIELDS      : Association to one
}

entity REQUEST_EVENTS_LOG {
 
    key REQUEST_NO : Integer64;
    key EVENT_NO   : Integer;
        EVENT_CODE : Integer;
        EVENT_TYPE : String(20);
        USER_ID    : String(100);
        USER_NAME  : String(100);
        REMARK     : String(100);
        COMMENT    : String(1000);
        CREATED_ON : Timestamp;
 
}

entity DEALER_MASTER_S4_HANA {
    key BUKRS : String(4);
    key LIFNR : String(10);
        NAME1 : String(35);
}

entity USER_DELEGATION {
 
    key SR_NO          : Integer;
        ASSIGN_FROM    : String(50);
        ASSIGN_TO      : String(50);
        ASSIGN_TO_NAME : String(100);
        REASON         : String(1000);
        DEL_FROM_DATE  : Timestamp;
        DEL_TO_DATE    : Timestamp;
        STATUS         : String(1);
        ENTITY_CODE    : String(10);
 
}

entity REQUEST_ACTIVE_STATUS {
 
    key REQUEST_NO       : Integer64;
        ACTIVE           : String(1);
        TYPE             : Integer;
        UPDATED_ON       : Timestamp;
        IDEAL_DEALER_CODE : Integer64;
 
}

 