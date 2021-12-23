import { Drizzle } from "@drizzle/store";

import ApeSurveyContract from './contracts/ApeSurveyContract.json';

const options = {
    contracts: [
        ApeSurveyContract
    ]
    // TODO add events to sync state with
    // events: {
    //     ApeSurveyContract: [
            
    //     ]
    // }
}

const drizzle = new Drizzle(options);

export default drizzle;