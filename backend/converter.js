function parseEdiText(ediText) {
    const lines = ediText.split('~');
    const data = {};
    lines.forEach(line => {
        const segments = line.split('*');
        const segmentId = segments.shift();
        data[segmentId] = segments;
    });
    return data;
}
const xmlbuilder = require('xmlbuilder');

function transformToXml(parsedData) {
    const root = xmlbuilder.create('Root');

    // InterchangeControl
    const interchangeControl = root.ele('InterchangeControl');
    interchangeControl.ele('SenderID', parsedData['ISA'][2]);
    interchangeControl.ele('ReceiverID', parsedData['ISA'][4]);
    interchangeControl.ele('ControlNumber', parsedData['ISA'][9]);
    interchangeControl.ele('Date', `20${parsedData['ISA'][5].slice(4, 6)}-${parsedData['ISA'][5].slice(2, 4)}-${parsedData['ISA'][5].slice(0, 2)}`);
    interchangeControl.ele('Time', parsedData['ISA'][6]);

    // FunctionalGroupHeader
    const functionalGroupHeader = root.ele('FunctionalGroupHeader');
    functionalGroupHeader.ele('FunctionalIdentifierCode', parsedData['GS'][1]);
    functionalGroupHeader.ele('SenderID', parsedData['GS'][2]);
    functionalGroupHeader.ele('ReceiverID', parsedData['GS'][3]);
    functionalGroupHeader.ele('Date', parsedData['GS'][4]);
    functionalGroupHeader.ele('Time', parsedData['GS'][5]);
    functionalGroupHeader.ele('ControlNumber', parsedData['GS'][6]);
   
    // TransactionSetHeader
    const transactionSetHeader = root.ele('TransactionSetHeader');
    transactionSetHeader.ele('TransactionSetID', parsedData['ST'][1]);
    transactionSetHeader.ele('TransactionSetControlNumber', parsedData['ST'][2]);

    // TransactionInfo
    const transactionInfo = root.ele('TransactionInfo');
    transactionInfo.ele('TransactionTypeCode', parsedData['BGN'][0]);
    transactionInfo.ele('ReferenceNumber', parsedData['BGN'][1]);
    transactionInfo.ele('Date', parsedData['BGN'][2]);
    transactionInfo.ele('Time', parsedData['BGN'][3]);

    // // Party
    const party = root.ele('Party');
    party.ele('Name', parsedData['N1'][1]);
    party.ele('IDType', parsedData['N1'][2]);
    party.ele('ID', parsedData['N1'][3]);

    // // Contact
    const contact = root.ele('Contact');
    contact.ele('Name', parsedData['PER'][1]);
    contact.ele('Telephone', parsedData['PER'][2]);
    contact.ele('Extension', parsedData['PER'][3]);

    // // OriginalTransaction
    const originalTransaction = root.ele('OriginalTransaction');
    originalTransaction.ele('TransactionSetID', parsedData['OTI'][0]);
    originalTransaction.ele('Date', parsedData['OTI'][2]);
    originalTransaction.ele('Time', parsedData['OTI'][3]);
    originalTransaction.ele('OriginalControlNumber', parsedData['OTI'][5]);

    return root.end({ pretty: true });
}

const fs = require('fs');
const path = require('path');


// console.log('Parsed Data:', parsedData);
module.exports = {
    transformToXml: transformToXml,
    parseEdiText: parseEdiText
};