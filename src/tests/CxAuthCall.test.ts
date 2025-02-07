import {CxScanConfig} from '../main/CxScanConfig';
import {CxAuth} from '../main/CxAuth';
import {CxParamType} from '../main/CxParamType';
import 'babel-polyfill';
import {CxCommandOutput} from "../main/CxCommandOutput";
import {logger} from "../main/loggerConfig"

let cxScanConfig = new CxScanConfig();
cxScanConfig.baseUri = process.env["CX_BASE_URI"];
cxScanConfig.clientId = process.env["CX_CLIENT_ID"];
cxScanConfig.clientSecret = process.env["CX_CLIENT_SECRET"];
if(process.env["PATH_TO_EXECUTABLE"] !== null && process.env["PATH_TO_EXECUTABLE"] !== undefined ) {
    cxScanConfig.pathToExecutable = process.env["PATH_TO_EXECUTABLE"];
}
let params = new Map();
params.set(CxParamType.PROJECT_NAME, "ASTJavascriptWrapperTest");
params.set(CxParamType.SCAN_TYPES, "sast");

params.set(CxParamType.S, ".");
params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
const auth = new CxAuth(cxScanConfig);

describe("ScanCreate cases",() => {
    it('ScanCreate Successful case wait mode', async () => {
    const data = await auth.scanCreate(params);
    const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))    
    const ScanObject = cxCommandOutput.scanObjectList.pop()
    const scanShowObject = await auth.scanShow(ScanObject.ID);
    logger.info(" Json object from successful wait mode case: " + JSON.stringify(scanShowObject))
    expect(scanShowObject.scanObjectList.pop().Status).toEqual("Completed")   
})

    it('ScanCreate Successful case with Branch', async () => {
        params.set(CxParamType.BRANCH, "main");
        //params.set(CxParamType.PROJECT_NAME, "ASTJavascriptWrapperTest");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        const ScanObject = cxCommandOutput.scanObjectList.pop()
        const scanShowObject = await auth.scanShow(ScanObject.ID);
        logger.info(" Json object from successful wait mode case with branch: " +JSON.stringify(scanShowObject))
        expect(scanShowObject.scanObjectList.pop().Status).toEqual("Completed")

    })

    it('ScanCreate Failure case', async () => {
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Jay");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        const ScanObject = cxCommandOutput.scanObjectList.pop()
        const scanShowObject = await auth.scanShow(ScanObject.ID);
        logger.info(" Json object from failure case: " + JSON.stringify(scanShowObject))
        expect(scanShowObject.scanObjectList.pop().Status).toEqual("Failed")
    })

    it('ScanCreate Successful case no wait mode', async () => {
        params.set(CxParamType.PROJECT_NAME, "ASTJavascriptWrapperTestNoWait");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, "--nowait");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))     
        const ScanObject = cxCommandOutput.scanObjectList.pop()
        const scanShowObject = await auth.scanShow(ScanObject.ID);
        logger.info(" Json object from successful no wait mode case: " + JSON.stringify(scanShowObject))
        expect(scanShowObject.scanObjectList.pop().Status).toEqual("Running")
    })

});

describe("ScanList cases",() => {
    it('ScanList Successful case', async () => {
        const data = await auth.scanList();
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        expect(cxCommandOutput.scanObjectList.length).toBeGreaterThan(0);
    });
});

describe("ProjectList cases",() => {
    it('ProjectList Successful case', async () => {
        const data = await auth.projectList();
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        expect(cxCommandOutput.scanObjectList.length).toBeGreaterThan(0);
    });
});

describe("Results cases",() => {
    it('Result List Successful case', async () => {
        const data = await auth.scanList();
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        let sampleId  = cxCommandOutput.scanObjectList.pop().ID;
        const written = await auth.getResults(sampleId,"test.json",null)
        logger.info(written)
        expect(cxCommandOutput.scanObjectList.length).toBeGreaterThan(0);
    });
});