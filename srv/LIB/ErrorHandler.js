const cds = require("@sap/cds");

exports.Handler = async function(req,sType,sMessage){

    var oMessage = JSON.stringify(sMessage);

    if (sType === 'error')
        req.error(oMessage);
    else if (sType === 'warn')
        req.error(req.warn(oMessage));
    else if (sType === 'info')
        req.info(oMessage);
    else if (sType === 'notify')
        req.notify(oMessage);
    else if (sType === 'reject')
        req.reject(oMessage);
    else if (sType === 'success')
        req.reply(oMessage);

}