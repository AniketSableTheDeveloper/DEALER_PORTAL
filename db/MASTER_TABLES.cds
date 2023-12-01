
context DEALER_PORTAL {

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
            SETTING     : String(10);
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
    
}