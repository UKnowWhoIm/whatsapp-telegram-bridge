import { env } from 'process';
import { readFileSync } from 'fs';

export function loadSettings(){
    try{
        return JSON.parse(readFileSync('settings.json'));
    }
    catch(e){
        return {
            'TOKEN': env.TOKEN,
            'PIPES': JSON.parse(env.PIPES),
            'ADD_DEFAULT_HEADER': env.ADD_DEFAULT_HEADER !== "false",
            'CUSTOM_HEADER': env.CUSTOM_HEADER
        };
    }
}

export function parseContacts(vCard){
    try{
        const nameRegex = /FN:(.+)/
        const phoneRegex = /TEL;waid=(\d+):/;
        const altPhoneRegex = /TEL:\+([\d ]+)/
        let firstName = vCard.match(nameRegex)[1];
        let phoneNo = vCard.match(phoneRegex);
        
        if(phoneNo === null)
            // If contact has no whatsapp
            phoneNo = vCard.match(altPhoneRegex)[1].replace(/ /g, '');
        else
            phoneNo = phoneNo[1];
        
        return{
            "firstName": firstName,
            "phoneNo": phoneNo
        }
    }
    catch(err){
        console.log(err);
        return null;
    }
}