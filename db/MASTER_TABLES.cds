using { DEALER_PORTAL.MASTER_ENTITY_CODE } from '../db/MASTER_TABLES';


context DEALER_PORTAL {

    entity MASTER_APPROVAL_HIERARCHY{
        key HIERARCHY_ID : String(10);
        ENTITY_CODE : String(10);
        LEVEL : Integer;
        ROLE_CODE : String(10);
        key TYPE : String(10);
        ACCESS_EDIT : String(1);
        ACCESS_APPROVE : String(1);
        ACCESS_SENDBACK : String(1);
        ACCESS_REJECT : String(1);
        TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
                            on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;

    }

    entity MASTER_APPROVAL_MATRIX{
        key HIERARCHY_ID : String(10);
        USER_IDS : String(1000);
        key TYPE : String(10);
    }

    entity MASTER_USER_ROLE {
        key CODE        : String(25);
            DESCRIPTION : String(100);
    }

    entity MASTER_TABLENAMES {
        key SR_NO             : Integer;
            TABLE_CODE        : String(25) not null;
            TABLE_NAME        : String(50) not null;
            TABLE_TYPE        : String(25) not null;
            COLUMN_COUNT      : Integer not null;
            TABLE_DESCRIPTION : String(100);
            PRIMARY_KEY :String(300);
    }

    entity MASTER_COUNTRY {
        key LAND1 : String(3);
        key LANDX : String(15);
        key NATIO : String(25);
    }

    entity MASTER_REGION {
        key LAND1 : String(3);
        key BLAND : String(3);
        key BEZEI : String(20);
    }

    entity MASTER_CURRENCY {

        key WAERS : String(5);
            LTEXT : String(40);

    }

    entity MASTER_TELECODE {
        key LAND1   : String(3);
            TELEFTO : String(4);
            TO_COUNTRY       : Association to one MASTER_COUNTRY
                               on TO_COUNTRY.LAND1 = LAND1;
    }

    entity MASTER_ENTITY_CODE {

        key BUKRS : String(4);
            BUTXT : String(50);
            ORT01 : String(25);
            WAERS : String(5);

    }

    entity MASTER_ATTACHMENT_TYPES {
        key CODE              : Integer not null;
            DESCRIPTION       : String(100);
            SHORT_DESCRIPTION : String(10);
            TYPE              : String(10);
            GROUP1            : String(10);
            GROUP2            : String(10); // Table group
    }

    entity MASTER_IAS_USER {

        key USER_ID      : String(50);
            STATUS       : String(50);
            LOGIN        : String(50);
        key EMAIL        : String(150)@Communication.IsEmailAddress;
            FIRST_NAME   : String(250);
            LAST_NAME    : String(250);
            COMPANY_CODE : String(100);
            EMP_NO       : String(100);
            MOBILE_NO : String(15) @Communication.IsPhoneNumber;

    }

    entity MASTER_IBAN_COUNTRY {
        key LAND1  : String(3);
        key LANDX  : String(25);
        key LENGTH : Integer
    }

    entity MASTER_IDEAL_SETTINGS {
        key CODE        : String(25);
            DESCRIPTION : String(100);
            SETTING     : String(100);
            TYPE        : String(10)
    }

    entity MASTER_REGEX_POSTALCODE {
        key LAND1     : String(3);
            REGEX     : String(250);
            REGEX_EXP : String(250);
    }

    entity MASTER_IDEAL_ATTACHMENTS {
        key SR_NO            : Integer;
        key ENTITY_CODE      : String(10);
        key ATTACH_CODE      : Integer;
            ATTACH_GROUP     : String(30);
            ATTACH_DESC      : String(100);
            FILE_NAME        : String(100);
            FILE_TYPE        : String(100);
            FILE_MIMETYPE    : String(100);
            FILE_CONTENT     : LargeBinary;
            UPLOADED_ON      : Timestamp;
            ATTACH_TYPE_CODE : String(10);
            ATTACH_TYPE_DESC : String(100);
    }

    entity MASTER_STATUS {
        key CODE        : Integer;
            DESCRIPTION : String(50);
    }

    entity MASTER_REQUEST_TYPE {
        key CODE          : Integer;
            DESCRIPTION   : String(50);
            SUPPLIER_TYPE : String(50);
    }

    entity MASTER_REQUEST_EVENTS {
        key CODE        : Integer;
            DESCRIPTION : String(50);
            TYPE        : String(25);
    }

    entity MASTER_REGFORM_FIELDS_ID_DESC {

        key FIELDS      : String(15);
            DESCRIPTION : String(500);
            CATEGORY    : String(50);
            SECTION     : String(50);

    }

    //request approval matrix
    entity MATRIX_REQUEST_APPR {

        key APPROVER_LEVEL : Integer;
        key USER_ROLE      : String(10);
        key USER_ID        : String(100);
        key ENTITY_CODE    : String(50);
            // key ENTITY_DESC : String(100);
            TO_USER_ROLE   : Association to one MASTER_USER_ROLE
                                 on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
                                 on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
    }

    // registration approval matrix
    entity MATRIX_REGISTRATION_APPR {

        key APPROVER_LEVEL : Integer;
        key USER_ROLE      : String(10);
        key USER_ID        : String(100);
        key ENTITY_CODE    : String(10);
            TO_USER_ROLE   : Association to one MASTER_USER_ROLE
                                 on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
                                 on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
    }
    //user master
    //make user_role as key for SA/CM access
    entity MASTER_IDEAL_USERS {
        key SR_NO            : Integer;
            USER_ID          : String(50);
        key USER_ROLE        : String(50);
            USER_NAME        : String(500);
        key EMAIL            : String(150);
            COMPANY_CODE     : String(500);
            EMP_NO           : String(100);
            CREATED_ON       : Timestamp;
            UPDATED_ON       : Timestamp;
            ACTIVE           : String(1);
            TO_USER_ROLE     : Association to one MASTER_USER_ROLE
                                   on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE   : Association to one MASTER_ENTITY_CODE
                                   on TO_ENTITY_CODE.BUKRS = COMPANY_CODE;
            TO_USER_ENTITIES : Association to many MASTER_USER_ENTITY_CODES
                                   on TO_USER_ENTITIES.USER_ID = USER_ID;
    }

    entity MASTER_USER_ENTITY_CODES {
        key USER_ID     : String(50);
        key USER_ROLE   : String(50);
        key ENTITY_CODE : String(50);
            EMAIL       : String(150);
            ENTITY_DESC : String(100);
    }

    entity MASTER_CREDENTIAL {
        key SR_NO      : Integer;
            USERNAME   : String(100);
            PASSWORD   : String(100);
            TYPE       : String(100);
            ADD_INFO1  : String(100);
            ADD_INFO2  : String(100);
            ADD_INFO3  : String(100);
            CREATED_ON : Timestamp;
    }

    entity MASTER_EMAIL_CONTACT_ID {

        key SR_NO             : Integer;
            EMAIL_NOTIF_1     : String(100);
            EMAIL_NOTIF_2     : String(100);
            EMAIL_NOTIF_3     : String(100);
            CONTACT_ID_1      : String(100);
            CONTACT_ID_2      : String(100);
            CONTACT_ID_3      : String(100);
            CLIENT_FULL_NAME  : String(100);
            CLIENT_SHORT_NAME : String(100);
            CLIENT_COUNTRY    : String(100);

    }

    entity MASTER_IDEAL_SAP_DEALER_NO {
            // REG_NO : Integer64;
            SAP_DIST_CODE  : String(10);
        key IDEAL_DIST_CODE : Integer64;
            ACCOUNT_GROUP    : String(50)
    }

    entity MASTER_SAP_CLIENT {
        key SR_NO       : Integer;
            CLIENT      : Integer not null;
            DESTINTAION : String(25) not null;
    }

    entity MASTER_SUBACCOUNT {
        key SR_NO       : Integer;
            SUBACCOUNT  : String(50) not null;
            PORTAL_LINK : String(100);
            // DM_LIMIT : Integer;
    }

    entity EMAIL_CONFIG {
        key SR_NO      : Integer;
            HOST   : String(100);
            PORT   : Integer;
            SECURE       : Boolean;
            SENDER_EMAIL  : String(100);
            USERNAME  : String(100);
            PASSWORD  : String(100);
            CREATED_ON : Timestamp;
    }

    entity MASTER_REGFORM_FIELDS_CONFIG{
        CCODE : String(10);
        key REQ_TYPE : Integer;
        key TYPE : String(1);
        // Section 1 - General Section
        // Group 1 - General Information
        S1G1T1F1 : String(1);
        S1G1T1F2 : String(1);
        S1G1T1F3 : String(1);
        S1G1T1F4 : String(1);
        S1G1T1F5 : String(1);
        S1G1T1F6 : String(1);
        S1G1T1F7 : String(1);
        // Section 1 - General Section
        // Group 2 - Distributor Address
        S1G2T1F1 : String(1);
        S1G2T1F2 : String(1);
        S1G2T1F3 : String(1);
        S1G2T1F4 : String(1);
        S1G2T1F5 : String(1);
        S1G2T1F6 : String(1);
        S1G2T1F7 : String(1);
        S1G2T1F8 : String(1);
        S1G2T1F9 : String(1);
        S1G2T1F10 : String(1);
        // Section 1 - General Section
        // Group 3 - Other Office Address
        S1G3T1F1 : String(1);
        S1G3T1F2 : String(1);
        S1G3T1F3 : String(1);
        S1G3T1F4 : String(1);
        S1G3T1F5 : String(1);
        S1G3T1F6 : String(1);
        S1G3T1F7 : String(1);
        S1G3T1F8 : String(1);
        S1G3T1F9 : String(1);
        S1G3T1F10 : String(1);
        // Section 1 - General Section
        // Group 4 - Contact information
        S1G4T1F1 : String(1);
        S1G4T1F2 : String(1);
        S1G4T1F3 : String(1);
        S1G4T1F4 : String(1);
        S1G4T1F5 : String(1);
        S1G4T1F6 : String(1);
        S1G4T1F7 : String(1);
        S1G4T1F8 : String(1);
        S1G4T1F9 : String(1);
        // Section 1 - General Section
        // Group 5 - Other Contact information
        S1G5T2F1 : String(1);
        S1G5T2F2 : String(1);
        S1G5T2F3 : String(1);
        S1G5T2F4 : String(1);
        S1G5T2F5 : String(1);
        S1G5T2F6 : String(1);
        S1G5T2F7 : String(1);
        S1G5T2F8 : String(1);
        S1G5T2F9 : String(1);
        S1G5T2F10 : String(1);
        // Section 1 - General Section
        // Group 6 - Additional Information
        S1G6T1F1 : String(1);
        S1G6T1F2 : String(1);
        S1G6T1F3 : String(1);
        // Section 1 - General Section
        // Group 7 - Employee Details
        S1G7T1F1 : String(1);
        S1G7T1F2 : String(1);
        S1G7T1F3 : String(1);
        S1G7T1F4 : String(1);
        S1G7T1F5 : String(1);
        S1G7T1F6 : String(1);
        S1G7T1F7 : String(1);
        S1G7T1F8 : String(1);
        S1G7T1F9 : String(1);
        S1G7T1F10 : String(1);
        // Section 2 - Financial Section
        // Group 1 - Financial Information
        S2G1T1F1: String(1);
        S2G1T1F2: String(1);
        S2G1T1F3: String(1);
        S2G1T1F4: String(1);
        S2G1T1F5: String(1);
        S2G1T1F6: String(1);
        S2G1T1F7: String(1);
        S2G1T1F8: String(1);
        S2G1T1F9: String(1);
        S2G1T1F10: String(1);
        S2G1T1F11: String(1);
        S2G1T1F12: String(1);
        S2G1T1F13: String(1);
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        S2G2T1F1: String(1);
        S2G2T1F2: String(1);
        S2G2T1F3: String(1);
        S2G2T1F4: String(1);
        S2G2T1F5: String(1);
        S2G2T1F6: String(1);
        S2G2T1F7: String(1);
        S2G2T1F8: String(1);
        S2G2T1F9: String(1);
        S2G2T1F10: String(1);
        S2G2T1F11: String(1);
        S2G2T1F12: String(1);
        S2G2T1F13: String(1);
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        //Type 2 - VAT Details
        S2G2T2F1: String(1);
        S2G2T2F2: String(1);
        S2G2T2F3: String(1);
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        //Type 3 - ICV Details
        S2G2T3F1: String(1);
        // Section 3 - Operational Section
        // Group 1 - Business History Details
        S3G1T1F1 : String(1);
        S3G1T1F2 : String(1);
        S3G1T1F3 : String(1);
        S3G1T1F4 : String(1);
        S3G1T1F5 : String(1);
        S3G1T1F6 : String(1);
        // Section 3 - Operational Section
        // Group 2 - Customer Details
        S3G2T1F1 : String(1);
        S3G2T1F2 : String(1);
        S3G2T1F3 : String(1);
        S3G2T1F4 : String(1);
        // Section 3 - Operational Section
        // Group 3 - Promoter/Management Details
        S3G3T1F1 : String(1);
        S3G3T1F2 : String(1);
        S3G3T1F3 : String(1);
        S3G3T1F4 : String(1);
        S3G3T1F5 : String(1);
        S3G3T1F6 : String(1);
        S3G3T1F7 : String(1);
        // Section 4 - Attachment Section
        // Attachment 1 - Company Profile
        S4A1F1 : String(1);
        // Attachment 2 - Distributor Document
        S4A2F1 : String(1);
        // Attachment 3 - Bank Account letter issued by the Bank (In Bank's letterhead)
        S4A3F1 : String(1);
        // Attachment 4 - TRN Certificate (Tax Registration Number)
        S4A4F1 : String(1);
        // Attachment 5 - ISO Certificate
        S4A5F1 : String(1);
        // Attachment 6 - Other Quality certificates
        S4A6F1 : String(1);
        // Attachment 7 - Upload Disclosure Form
        S4A7F1 : String(1);
        
    }

    // entity MASTER_REGFORM_FIELDS{
    //     key FIELD_ID : String(20);
    //     DESCRIPTION : String(1000);
    // }
    
}

@cds.persistence.exists
@cds.persistence.calcview
entity USERMASTER_ENTITIES {
    key USER_NAME    : String(500) @title: 'USER_NAME: USER_NAME';
        EMAIL        : String(150) @title: 'EMAIL: EMAIL';
        COMPANY_CODE : String(500) @title: 'COMPANY_CODE: COMPANY_CODE';
        CREATED_ON   : Timestamp   @title: 'CREATED_ON: CREATED_ON';
        ACTIVE       : String(1)   @title: 'ACTIVE: ACTIVE';
        ENTITY_CODE  : String(50)  @title: 'ENTITY_CODE: ENTITY_CODE';
        ENTITY_DESC  : String(100) @title: 'ENTITY_DESC: ENTITY_DESC';
        USER_ID      : String(50)  @title: 'USER_ID: USER_ID';
        USER_ROLE    : String(50)  @title: 'USER_ROLE: USER_ROLE';
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity CALC_HIERARCHY_MATRIX {
key     HIERARCHY_ID: String(10)  @title: 'HIERARCHY_ID: HIERARCHY_ID' ; 
        ENTITY_CODE: String(10)  @title: 'ENTITY_CODE: ENTITY_CODE' ; 
        LEVEL: Integer  @title: 'LEVEL: LEVEL' ; 
        ROLE_CODE: String(10)  @title: 'ROLE_CODE: ROLE_CODE' ; 
        TYPE: String(10)  @title: 'TYPE: TYPE' ; 
        ACCESS_EDIT: String(1)  @title: 'ACCESS_EDIT: ACCESS_EDIT' ; 
        ACCESS_APPROVE: String(1)  @title: 'ACCESS_APPROVE: ACCESS_APPROVE' ; 
        ACCESS_SENDBACK: String(1)  @title: 'ACCESS_SENDBACK: ACCESS_SENDBACK' ; 
        ACCESS_REJECT: String(1)  @title: 'ACCESS_REJECT: ACCESS_REJECT' ; 
        USER_IDS: String(1000)  @title: 'USER_IDS: USER_IDS' ;
        TO_ENTITY_CODE : Association to one DEALER_PORTAL.MASTER_ENTITY_CODE
                            on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;

}