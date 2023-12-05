
context  DEALER_PORTAL{
    
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
 
    key IVEN_VENDOR_CODE : Int64;
        SAP_VENDOR_CODE  : String(10);
        OT_PARENT_ID     : String(10);
        OT_FOLDER1_ID    : String(25);
        OT_FOLDER2_ID    : String(25);
        OT_FOLDER3_ID    : String(25);
        OT_FOLDER4_ID    : String(25);
}
}
 