namespace DEALER_PORTAL;

using {
    DEALER_PORTAL.MASTER_STATUS,
    DEALER_PORTAL.MASTER_ENTITY_CODE,
    DEALER_PORTAL.MASTER_REQUEST_TYPE,
    DEALER_PORTAL.MASTER_COUNTRY,
    DEALER_PORTAL.MASTER_REGION,
    DEALER_PORTAL.MASTER_CURRENCY
} from '../db/MASTER_TABLES';

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

    key IDEAL_DIST_CODE : Int64;
        SAP_DIST_CODE   : String(10);
        OT_PARENT_ID    : String(10);
        OT_FOLDER1_ID   : String(25);
        OT_FOLDER2_ID   : String(25);
        OT_FOLDER3_ID   : String(25);
        OT_FOLDER4_ID   : String(25);
}

entity REQUEST_INFO {
    key REQUEST_NO            : Integer64;
        MOBILE_NO             : String(30);  //added 05/01/2023
        SAP_DIST_CODE         : String(10); //SAP_DEALER_CODE
        IDEAL_DIST_CODE       : Integer64; //IDEAL_DEALER_CODE
        STATUS                : Integer;
        REGISTERED_ID         : String(100); // Dealer Primary Email ID
        ENTITY_CODE           : String(10);
        REQUEST_TYPE          : Integer;
        CREATION_TYPE         : Integer;
        DIST_NAME1            : String(100); //DEALER_NAME1
        DIST_NAME2            : String(100); //DEALER_NAME2
        DIST_CODE             : String(50); //DEALER_CODE
        APPROVER_LEVEL        : Integer;
        HIERARCHY_ID          : String(10);
        REQUESTER_ID          : String(100); // Request creator i.e. Buyer Email ID
        BP_TYPE_CODE          : String(4);
        BP_TYPE_DESC          : String(100);
        REQUEST_RESENT        : String(5);
        MDG_CR_NO             : String(15);
        LAST_ACTIVE_REQ_NO    : Integer64;
        SECONDARY_EMAILS_ID   : String(500);
        ESTAB_YEAR            : String(4);
        WEBSITE               : String(100);
        VAT_REG_NUMBER        : String(25);
        VAT_REG_DATE          : Date;
        VAT_CHECK             : String(1);
        LAST_SAVED_STEP       : Integer;
        COMPLETED_BY          : String(100);
        COMPLETED_BY_POSITION : String(50);
        ACK_VALIDATION        : String(5);
        SUBMISSION_DATE       : Timestamp;
        LAST_UPDATED_ON       : Timestamp;
        OT_PARENT_ID          : String(10);
        OT_FOLDER1_ID         : String(25);
        OT_FOLDER2_ID         : String(25);
        OT_FOLDER3_ID         : String(25);
        OT_FOLDER4_ID         : String(25);
        NDA_TYPE              : String(50);
        REMINDER_COUNT        : Integer;
        BUYER_ASSIGN_CHECK    : String(1);
        CREATED_ON            : Timestamp;
        COMMENT               : String(1000);
        LEGACY_ID             : String(10);
        //refer from ideal
        BU_CODE               : String(50);
        TOT_PERM_EMP          : Integer;
        TOT_TEMP_EMP          : Integer;
        NOE_ACC               : Integer;
        NOE_ADM               : Integer;
        NOE_HR                : Integer;
        NOE_QA                : Integer;
        NOE_MAN               : Integer;
        NOE_SAL               : Integer;
        NOE_SEC               : Integer;
        NOE_ANY               : Integer;
        SAP_DIST_NO           : String(10);
        PROPOSAL_DATE         : Date;
        ENTITY_NAME           : String(50);
        BUSINESS_NATURE       : String(20);
        TERR_HOSP_ACC         : String(100);
        SELLING_POINT         : String(200);
        DIST_RECOMMMEDATION   : String(200);
        DIST_RELATION         : String(200);
        SALES_ASSOCIATE_ID    : String(100);
        SA_APPROVED_ON        : Timestamp;
        SAVED_AS_DRAFT        : Integer;
        // Fields from ideal
        REGISTERED_ADDR       : String(10);
        OFFICE_ADDR           : String(10);
        SHIP_TO_ADDR          : String(10);
        WAREHOUSE_ADDR        : String(10);
        //commented fields from iven
        // SUPPL_CATEGORY           : String(5000);
        // SUPPL_CATEGORY_DESC      : String(5000);
        // BUSINESS_TYPE            : String(50);
        // TRADE_LIC_NO             : String(50);
        // TRADE_LIC_NO_DATE        : Date;
        // APPROVER_ROLE            : String(50);
        // NEXT_APPROVER            : String(100);
        // SUPPL_TYPE            : String(50);
        // SUPPL_TYPE_DESC       : String(50);
        TO_STATUS             : Association to one DEALER_PORTAL.MASTER_STATUS
                                    on TO_STATUS.CODE = STATUS;
        TO_ENTITY_CODE        : Association to one DEALER_PORTAL.MASTER_ENTITY_CODE
                                    on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
        TO_REQUEST_TYPE       : Association to one DEALER_PORTAL.MASTER_REQUEST_TYPE
                                    on TO_REQUEST_TYPE.CODE = REQUEST_TYPE;
        TO_ADDRESS            : Association to many DEALER_PORTAL.REGFORM_ADDRESS
                                    on TO_ADDRESS.REQUEST_NO = REQUEST_NO;
        TO_CONTACTS           : Association to many DEALER_PORTAL.REGFORM_CONTACTS
                                    on TO_CONTACTS.REQUEST_NO = REQUEST_NO;
        TO_BANKS              : Association to many DEALER_PORTAL.REGFORM_BANKS
                                    on TO_BANKS.REQUEST_NO = REQUEST_NO;
        // TO_OWNERS                : Association to many DEALER_PORTAL.REGFORM_OWNERS
        //                                on TO_OWNERS.REQUEST_NO = REQUEST_NO;
        // TO_PRODUCT_SERVICES      : Association to many DEALER_PORTAL.REGFORM_PRODUCT_SERVICE
        //                                on TO_PRODUCT_SERVICES.REQUEST_NO = REQUEST_NO;
        // TO_CAPACITY              : Association to many DEALER_PORTAL.REGFORM_CAPACITY
        //                                on TO_CAPACITY.REQUEST_NO = REQUEST_NO;
        TO_CUSTOMERS          : Association to many DEALER_PORTAL.REGFORM_CUSTOMERS
                                    on TO_CUSTOMERS.REQUEST_NO = REQUEST_NO;
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

    key REQUEST_NO      : Integer64;
        ACTIVE          : String(1);
        TYPE            : Integer;
        UPDATED_ON      : Timestamp;
        IDEAL_DIST_CODE : Integer64;

}

entity IDEAL_EMAIL_LOG {

    key LOG_ID       : UUID;
        STATUS       : Integer;
        STATUS_DSC   : String(50);
        LOG          : String;
        CREATED_ON   : Timestamp;
        CREATED_DATE : Timestamp;
        USER_ID      : String(50);
        TO_EMAIL     : String(1000);
        CC_EMAIL     : String(1000);
        SUBJECT      : String(100);
        BODY         : String;
        TYPE         : String(10);

}

entity REGFORM_BUSINESS_HISTORY {

    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer not null;
        DEALERSHIP    : String(50);
        SUPPLIER_NAME : String(50);
        SINCE         : Integer;
        PROD_GROUP    : String(50);
        PURCHASES     : Integer;

}

entity REGFORM_CUSTOMERS {
    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer;
    key CUST_NO       : Integer not null;
        CUSTOMER_NAME : String(100);
        YEAR1         : Double;
        YEAR2         : Double;
}

entity REGFORM_PROMOTERS {

    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer;
        NAME          : String(50);
        QUALIFICATION : String(20);
        WORK_EXP      : Double;
        YRS_IN_COMP   : Double;
        DESIGNATION   : String(20);
        ROLE          : String(20);

}

entity REGFORM_ADDRESS {

    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        ADDRESS_TYPE     : String(50);
        ADDRESS_DESC     : String(50);
        HOUSE_NUM1       : String(10);
        STREET1          : String(60);
        STREET2          : String(40);
        STREET3          : String(40);
        STREET4          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        COUNTRY          : String(100);
        POSTAL_CODE      : String(10);
        CONTACT_NO       : String(30);
        CONTACT_TELECODE : String(4);
        FAX_NO           : String(10);
        EMAIL            : String(241);
        DISTRICT         : String(35);
        //taken from ideal
        ADDR_CODE        : String(10);
        TO_COUNTRY       : Association to one MASTER_COUNTRY
                               on TO_COUNTRY.LAND1 = COUNTRY;
        TO_REGION        : Association to one MASTER_REGION
                               on  TO_REGION.LAND1 = COUNTRY
                               and TO_REGION.BLAND = STATE;
}

entity REGFORM_CONTACTS {
    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        NAME1            : String(35);
        NAME2            : String(35);
        HOUSE_NUM1       : String(10);
        STREET1          : String(40);
        STREET2          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        POSTAL_CODE      : String(10);
        DESIGNATION      : String(50);
        NATIONALITY      : String(30);
        PASSPORT_NO      : String(30);
        EMAIL            : String(241);
        CONTACT_NO       : String(30);
        MOBILE_NO        : String(30);
        CONTACT_TYPE     : String(10);
        CONTACT_TELECODE : String(4);
        MOBILE_TELECODE  : String(4);
        BP_ID            : String(10);
        //taken from ideal
        LOC_NO           : Integer not null;
        LOC_TYPE         : String(2) not null;
        BR_WH_NO         : Integer;
        ADDR_CODE        : String(10);
        CONCERN_TYPE     : String(10);
        INFRA_DETAIL     : String(50);
        TEMP_DETAIL      : Integer;
        PROPERTY_TYPE    : String(10);
        ON_LEASE         : String(1);
        ATTACH_CODE      : Integer;
        FILE_NAME        : String(100);
        FILE_TYPE        : String(100);
        FILE_MIMETYPE    : String(100);
        FILE_CONTENT     : LargeBinary;
        UPLOAD_DATE      : Timestamp;
        TO_COUNTRY       : Association to one MASTER_COUNTRY
                               on TO_COUNTRY.LAND1 = NATIONALITY;
        TO_REGION        : Association to one MASTER_REGION
                               on  TO_REGION.LAND1 = NATIONALITY
                               and TO_REGION.BLAND = STATE;
}

entity REGFORM_ATTACHMENTS {

    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        ATTACH_CODE      : Integer;
        ATTACH_GROUP     : String(30);
        ATTACH_DESC      : String(100);
        ATTACH_VALUE     : String(100);
        EXPIRY_DATE      : Date;
        FILE_NAME        : String(100);
        FILE_TYPE        : String(100);
        FILE_MIMETYPE    : String(100);
        FILE_CONTENT     : LargeBinary;
        UPLOADED_ON      : Timestamp;
        OT_DOC_ID        : String(10);
        OT_LAST_DOC_ID   : String(10);
        UPDATE_FLAG      : String(1);
        DELETE_FLAG      : String(1);
        ATTACH_SHORT_DEC : String(50);
        ATTACH_FOR       : String(50);
}

entity REGFORM_ATTACH_FIELDS {
    key REQUEST_NO                 : Integer64;
        // If UAE Company
        IS_UAE_COMPANY             : String(5);
        // Do you issue an Electronic Tax Invoice
        ISSUE_ELEC_TAX_INV         : String(100);
        // Are you a Sole Agent / Distributor / Dealer for a manufacturer / service provider
        SOLE_DIST_MFG_SER          : String(5);
        //SOLE_DIST_MFG_SER_TYPE : String(100);

        // Passport  Representative / Authorized person
        PASSPORT_OF_AUTH_SIGNATORY : String(5);
        PASSPORT_REPR_AUTH_PERSON  : String(5);
}

entity REGFORM_BANKS {

    key REQUEST_NO          : Integer64;
    key SR_NO               : Integer;
        NAME                : String(100);
        BENEFICIARY         : String(100);
        ACCOUNT_NO          : String(38); //18 (account no) + 20 (BankRef)
        ACCOUNT_NAME        : String(40);
        ACCOUNT_HOLDER      : String(60);
        BANK_ID             : String(4);
        BANK_KEY            : String(15);
        BANK_COUNTRY        : String(50); //3 length
        BRANCH_NAME         : String(100);
        IBAN_NUMBER         : String(34); //34 length
        SWIFT_CODE          : String(15);
        BIC_CODE            : String(15);
        ROUTING_CODE        : String(15);
        OTHER_CODE          : String(1);
        OTHER_CODE_NAME     : String(15);
        OTHER_CODE_VAL      : String(15);
        PAYMENT_METHOD      : String(25);
        PAYMENT_METHOD_DESC : String(30);
        PAYMENT_TERMS       : String(25);
        PAYMENT_TERMS_DESC  : String(30);
        INVOICE_CURRENCY    : String(25);
        VAT_REG_NUMBER      : String(25);
        VAT_REG_DATE        : Date;
        DUNS_NUMBER         : String(10);
        BANK_CURRENCY       : String(5);
        BANK_NO             : String(15);
        PAYMENT_TYPE        : String(10);
        //Fields From Ideal
        FACILTY             : String(20);
        AMOUNT_LIMIT        : Double;
        ASSO_SINCE          : Integer;
        TO_COUNTRY          : Association to one MASTER_COUNTRY
                                  on TO_COUNTRY.LAND1 = BANK_COUNTRY;
        TO_CURRENCY         : Association to one MASTER_CURRENCY
                                  on TO_CURRENCY.WAERS = BANK_CURRENCY;
}

entity REQUEST_SECURITY_CODE {

    key REGISTERED_ID : String(100);
        SEC_CODE      : String(100);
        CREATED_ON    : Timestamp;

}

